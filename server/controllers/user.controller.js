import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

  try {
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

    const createdUser = await User.findById(newUser._id).select(
      "-password -refreshToken -accessToken"
    );

    if (!createdUser) {
      return next(
        new ApiError(500, "Something went wrong while registering the user.")
      );
    }
    console.log(`${createdUser.name} registered Successfully🎉`);
    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          createdUser,
          `${createdUser.name} registered Successfully🎉`
        )
      );
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Error occured while creating the user: ${error.message}`
      )
    );
  }
});

export { addUser };
