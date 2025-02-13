import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import xss from "xss-clean";
import httpStatus from "http-status";
import multer from "multer"
import config from "./config/config.js";
import morgan from "./config/morgan.js";
import router from "./routes/v1/index.js";
import { ApiError } from "./modules/utils/APiError.js";
import { errorConverter, errorHandler } from "./middleware/error.js";

const app = express();
const upload = multer()

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}
// middlewares
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.options("*", cors());
app.use(xss());
app.use(mongoSanitize());
app.use(compression());
app.use(upload.any())

app.use("/api/v1", router);

app.use(async (req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "The path does not exist"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

app.use(errorHandler);
export default app;
