import { Document } from "mongoose";

declare module "express" {
  interface Request {
    user?: Document;
  }
}
