import { config } from "dotenv";
config();
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import compression from "compression";
import cors from "cors";

// Route imports
import { userRoute } from "./routes/userRoute";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);

app.use(compression);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Server state
app.get("/", (req: Request, res: Response) => {
  res.send("Api is running...");
});

// Routes
const apiVersion = "/api/v1";
app.use(`/api/v1/auth`, userRoute);

//DB connection and server running
const port = process.env.PORT;
const dbUri = process.env.DB_URL;

mongoose
  .connect(dbUri)
  .then(() => {
    app.listen(port, () => {
      console.log("Connected to DB. Server is live on port: ", port);
    });
  })
  .catch((err) => console.log(err.message));
