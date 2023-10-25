import mongoose from "mongoose";
import express from "express";
import { userModel } from "../models/userModel";
import validator from "validator";
import { hashPassword, comparePassword } from "../utils/hashing";
import { createToken } from "../utils/jwtTokenHandler";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { fullName, emailOrPhone, password, confirmPassword } = req.body;

    if (!fullName) {
      return res.status(404).json({
        success: false,
        message: "Please enter your full name",
      });
    }

    if (!emailOrPhone) {
      return res.status(404).json({
        success: false,
        message: "Please enter a valid email or phone number",
      });
    }

    if (!password) {
      return res.status(404).json({
        success: false,
        message: "Please enter password",
      });
    }

    if (!confirmPassword) {
      return res.status(404).json({
        success: false,
        message: "Please confirm your password",
      });
    }

    if (confirmPassword !== password) {
      return res.status(404).json({
        success: false,
        message: "Passwords are not the same",
      });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least one uppercase, lowercase, number and special character",
      });
    }

    const hash = await hashPassword(password);

    // Check if the emailOrPhone is a valid email
    if (validator.isEmail(emailOrPhone)) {
      //Check if the email exist on the DB
      const user = await userModel.findOne({ emailOrPhone });

      if (user) {
        return res.status(404).json({
          success: false,
          message: "Email already exists",
        });
      }

      const { _id } = await userModel.create({
        fullName,
        emailOrPhone,
        password: hash,
      });

      return res.status(200).json({
        success: true,
        message: "Successfully signed up with email",
      });
    }

    // Check if the emailOrPhone is a valid phone number
    if (validator.isMobilePhone(emailOrPhone)) {
      //Check if the number exist on the DB
      const user = await userModel.findOne({ emailOrPhone });

      if (user) {
        return res.status(404).json({
          success: false,
          message: "Phone number already exists",
        });
      }

      const { _id } = await userModel.create({
        fullName,
        emailOrPhone,
        password: hash,
      });

      return res.status(200).json({
        success: true,
        message: "Successfully signed up with phone number",
      });
    }

    //Handle invalid email or phone number error
    return res
      .status(400)
      .json({ success: false, message: "Invalid email or phone number" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!password) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = await userModel.findOne({ emailOrPhone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "We cannot find an account with that email or phone number",
      });
    }

    const matchPassword = await comparePassword(password, user.password);

    if (!matchPassword) {
      return res.status(404).json({
        success: false,
        message: "Invalid login credentials",
      });
    }

    const token = createToken(user._id, process.env.EXPIRATION_TIME);

    res.status(200).json({
      success: true,
      message: "Successfully logged in",
      data: {
        fullName: user.fullName,
        emailOrPhone: user.emailOrPhone,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
