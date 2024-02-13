import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { user } from "./routes/userRoute";
import morgan from 'morgan';

dotenv.config();

const app = express();
const MONGODB_URI = process.env.MONGODB_URI as string
const PORT = process.env.SERVER_PORT as string
const CLIENT_URI = process.env.CLIENT_URI as string

const corsOptions = {
  origin: CLIENT_URI,
  methods: 'GET,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

//MongoDB Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err: Error) => {
    console.log(err);
  });


// Middlewares
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan('combined'));


// CORS setup
app.use(cors(corsOptions));


// Routers
app.use("/", user);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
