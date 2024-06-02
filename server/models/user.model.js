import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

function validatePassword(password) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

function getDefaultProfileImage(gender) {
  if (gender === "male") {
    return "male.png";
  } else if (gender === "female") {
    return "female.png";
  } else {
    return "default.png";
  }
}

const UserData = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot excedd 50 characters"],
      validate: {
        validator: function (value) {
          return /^[a-zA-Z\s]+$/.test(value);
        },
        message: "Name can only contain letters and spaces.",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already in use."],
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
    },
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: [true, "Username is already in use. Try something else"],
      trim: true,
      minLength: [3, "Username must be at least 3 characters long."],
      maxlength: [20, "Username cannot exceed more than 20 characters"],
      validate: {
        validator: function (value) {
          return /^[a-zA-Z0-9]+$/.test(value);
        },
        message: "Username can only contain letters and numbers",
      },
    },
    dob: {
      type: Date,
      required: [true, "Date fo Birth is required"],
      validate: {
        validator: function (value) {
          const minDOB = new Date();
          minDOB.setFullYear(minDOB.getFullYear() - 120);
          const maxDOB = new Date();
          maxDOB.setFullYear(maxDOB.getFullYear() - 13);
          return value >= minDOB && value <= maxDOB;
        },
        message: "User age must be between 13 and 120 years.",
      },
    },
    publicAccount: {
      type: Boolean,
      default: true,
    },
    gender: {
      type: String,
      required: [true, "Gender value is required,"],
      enum: ["male", "female", "other"],
    },
    isGoogleSignedUp: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 6 characters long"],
      validate: {
        validator: function (value) {
          return validatePassword(value);
        },
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character, and be at least 8 characters long.",
      },
    },
    profileImage: [
      {
        type: String,
        defult: function () {
          return getDefaultProfileImage(this.gender);
        },
      },
    ],
    mobileNumber: {
      type: Number,
      required: [true, "Mobile Number is required"],
    },
    freinds: [
      {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
      },
    ],
    trips: [
      {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Trip",
      },
    ],
    posts: [
      {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Post",
      },
    ],
    badges: [
      {
        type: [String],
        enum: [
          "premium",
          "Roamio",
          "Mountain lover",
          "religious",
          "group traveller",
        ],
      },
    ],
    role: {
      type: String,
      default: "user",
      enum: ["user", "organizer", "admin"],
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

const PEPPER_SECRET = process.env.PEPPER_SECRET;

UserData.methods.generateAccessToken = function () {
  const accessToken = jwt.sign(
    {
      _id: this._id,
      username: this.username,
      role: this.role,
    },
    process.env.AccessToken_SECRET,
    {
      expiresIn: process.env.AccessToken_EXPIRY,
    }
  );
  return accessToken;
};

UserData.methods.generateRefreshToken = function () {
  const newRefreshToken = jwt.sign(
    {
      _id: this._id,
      username: this.username,
      role: this.role,
    },

    process.env.RefreshToken_SECRET,

    {
      expiresIn: process.env.RefreshToken_EXPIRY,
    }
  );
  this.refreshToken = newRefreshToken;
  return newRefreshToken;
};

UserData.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const pepperedPassword = this.password + PEPPER_SECRET;

  const saltRounds = Number(process.env.SALT_ROUNDS);

  this.password = await bcrypt.hash(pepperedPassword, saltRounds);

  next();
});

UserData.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password + PEPPER_SECRET, this.password);
};

const User = mongoose.model("User", UserData);

export default User;
// {
//     "name": "John Doe",
//     "email": "john.doe@example.com",
//     "username": "johndoe",
//     "dob": "1990-05-15", // Date of birth in YYYY-MM-DD format
//     "gender": "male",
//     "password": "Password@123", // Sample password
//     "mobileNumber": 1234567890 // Sample mobile number
//   }
