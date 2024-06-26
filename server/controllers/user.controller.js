import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import generateAccessTokenAndRefreshToken from "../utils/generateAccessAndRefreshToken.js";
import { cookieOptions } from "../config/cookies.config.js";
import generateRandomString from "../utils/randomString.js";

const userPublicDetails = asyncHandler(async (req, res) => {
  const users = await User.find();
  const userPublicDetails = users.map((user) => ({
    userId: user._id,
    profileImage: user.profileImage,
    username: user.username,
    name: user.name,
    email: user.email,
    joinedAt: user.createdAt,
  }));

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        userPublicDetails,
        "Users public information fetched successfully 🚀🎉"
      )
    );
});

const addUser = asyncHandler(async (req, res, next) => {
  const { name, email, username, password, dob, gender, mobileNumber } =
    req.body;
  const fileLinks = req.fileLinks;

  //joi validation

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    return next(
      new ApiError(409, "User with email or username already exists")
    );
  }

  if (!username) {
    const nameWithoutSpaces = name.replace(/\s+/g, "");
    const randomString = generateRandomString(3);
    username = nameWithoutSpaces + randomString;
  }

  const newUser = await User.create({
    name,
    email,
    username,
    password,
    dob,
    gender,
    mobileNumber,
    profileImage: fileLinks || null,
  });

  const createdUser = await User.findById(newUser._id)
    .select("-password -refreshToken -accessToken")
    .lean();

  if (!createdUser) {
    return next(
      new ApiError(500, "Something went wrong while registering the user.")
    );
  }
  console.log(`${createdUser.name} registered Successfully🎉`);

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(createdUser._id);

  if (!accessToken || !refreshToken) {
    throw new ApiError(500, "Failed to generate access and refresh tokens");
  }

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { createdUser, accessToken, refreshToken },
        `${createdUser.name} registered Successfully🎉`
      )
    );
});

const doesUserExist = asyncHandler(async (req, res, next) => {
  const { email } = req.query || req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(200)
      .json(new ApiResponse(200, { userFound: false }, "User not found!"));
  }

  const foundUser = {
    profileImage: user.profileImage,
    username: user.username,
    name: user.name,
    email: user.email,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, { userFound: true, foundUser , isGoogleSignedUp: user.isGoogleSignedUp }, "User found!"));
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, username, password } = req.body;
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  if (!accessToken || !refreshToken) {
    throw new ApiError(500, "Failed to generate access and refresh tokens");
  }

  const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")
    .lean();

  console.log(`${user.username} logged in successfully🎉`);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        `${user.username} logged in successfully🎉`
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.userId),
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully!"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.RefreshToken_SECRET
    );
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used .");
    }

    const { accessToken, newRefreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const googleAuth = asyncHandler(async (req, res) => {
  const {
    displayName,
    email,
    photoURL,
    uid,
    emailVerified,
    metadata,
    phoneNumber,
  } = req.body;

  if (!emailVerified) {
    throw new ApiError(401, "Google mail not verified .");
  }

  let user = await User.findOne({ email });
  if (!user) {
    const nameWithoutSpaces = displayName.replace(/\s+/g, "");
    const randomString = generateRandomString(3);
    const username = nameWithoutSpaces + randomString;
    const newUser = new User({
      name: displayName,
      email,
      username: username,
      dob: "1990-05-15",
      gender: "other",
      password: uid + metadata.createdAt + "A12a@",
      profileImage: [photoURL],
      mobileNumber: phoneNumber,
      isGoogleSignedUp: true,
    });

    user = await newUser.save();
  } else {
    const password = uid + metadata.createdAt + "A12a@";
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  if (!accessToken || !refreshToken) {
    throw new ApiError(500, "Failed to generate access and refresh tokens");
  }

  const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")
    .lean();

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully 🎉"
      )
    );
});

export {
  addUser,
  doesUserExist,
  loginUser,
  userPublicDetails,
  logoutUser,
  refreshAccessToken,
  googleAuth,
};
