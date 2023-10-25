import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { userModel } from "../../models/userModel";

export const authorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required",
      });
    }

    const token = authorization.split(" ")[1];
    const { _id } = jwt.verify(token, process.env.SECRET_KEY) as {
      _id: string;
    };

    req.user = await userModel.findOne({ _id });

    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "Request is not authorized",
    });
  }
};
