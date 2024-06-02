import User from "../models/user.model.js";
import { ApiError } from "./ApiError.js";
import { asyncHandler } from "./asyncHandler.js";

const generateAccessTokenAndRefreshToken = asyncHandler(async (userId) => {
    const user = await User.findById(userId);

    if (!user){
        throw new ApiError(404,'User not found');
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    await user.save({validateBeforeSave: false});

    return {accessToken , refreshToken};
})

export default generateAccessTokenAndRefreshToken;