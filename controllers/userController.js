import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";
import { User } from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import ApiFeatures from "../utils/apiFeatures.js";

export const register = catchAsyncError(async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return next(new ErrorHandler('All fields are required', 400));
    }

    let user = await User.findOne({ email });

    if (user) {
        return next(new ErrorHandler("User already exists", 409));
    }

    user = await User.create({
        firstName,
        lastName,
        email,
        password,
    });

    sendToken(res, user, "Registered Successfully", 201);

});

export const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please enter all fields", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) return next(new ErrorHandler("Incorrect Email or Password", 401));

    const isMatch = await user.comparePassword(password);

    if (!isMatch)
        return next(new ErrorHandler("Incorrect Email or Password", 401));

    sendToken(res, user, `Welcome back, ${user.firstName}`, 200);
});

export const logout = catchAsyncError(async (req, res, next) => {
    res
        .status(200)
        .cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
        .json({
            success: true,
            message: "Logged Out Successfully",
            isAuthenticated: false,
        });
});

export const isUserLoggedIn = catchAsyncError(async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded._id);

    res.status(200).json({
        success: true,
        isAuthenticated: true,
    })
});

export const getMyDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    res.status(200).json({
        success: true,
        user
    });
});

export const getAllUsers = catchAsyncError(async (req, res, next) => {
    const apiFeatures = new ApiFeatures(User.find({ role: "user" }), req.query).search().filter();
    const users = await apiFeatures.query;

    // console.log(users);

    res.status(200).json({
        success: true,
        users
    });
});


