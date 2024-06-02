import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import generateAccessTokenAndRefreshToken from "../utils/generateAccessAndRefreshToken.js";
import { cookieOptions } from "../config/cookies.config.js";

const userPublicDetails = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  const userPublicDetails = users.map((user) => ({
    userId: user._id,
    profileImage: user.profileImage,
    username: user.username,
    name: user.name,
    email: user.email,
    joinedAt: user.createdAt,
  }));

  res.status(200).res(next(new ApiResponse(200, userPublicDetails , "Users public information fetched successfully 🚀🎉")))
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
});

const doesUserExist = asyncHandler(async (req, res, next) => {
  const { email } = req.query || req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(200)
      .json(
        next(new ApiResponse(404, { userFound: false }, "User not found!"))
      );
  }

  const foundUser = {
    profileImage: user.profileImage,
    username: user.username,
    name: user.name,
    email: user.email,
  };

  return res
    .status(200)
    .json(
      next(new ApiResponse(200, { userFound: true, foundUser }, "User found!"))
    );
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

  const loggedInUser = user.select("-password -refreshToken");

  console.log(`${user.username} logged in successfully🎉`);

  return res.status(
    (200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        next(
          new ApiResponse(
            200,
            { user: loggedInUser, accessToken, refreshToken },
            `${user.username} logged in successfully🎉`
          )
        )
      )
  );
});

export { addUser, doesUserExist, loginUser , userPublicDetails };
