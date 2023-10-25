import { register, login } from "../controllers/userCtrl";
import express from "express";

export const userRoute = express.Router();

userRoute.post("/register", register);
userRoute.post("/login", login);
