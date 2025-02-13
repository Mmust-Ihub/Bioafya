import jwt from "jsonwebtoken";
import createError from "http-errors";
import config from "../config/config.js";
import { catchAsync } from "../modules/utils/catchAsync.js";
import { ApiError } from "../modules/utils/APiError.js";

const generateAccessToken = async (data) => {
  return new Promise((resolve, reject) => {
    const payload = {
      email: data.email,
    };
    const expire_time = config.jwt.accessExpirationSeconds;
    const options = {
      expiresIn: expire_time,
      audience: data.userID,
      issuer: "application",
    };
    jwt.sign(payload, config.jwt.secret, options, (error, token) => {
      if (error) {
        const err = createError.InternalServerError(
          "error when generating token "
        );
        return reject(err);
      }
      resolve(token);
    });
  });
};

const verifyAccessToken = catchAsync(async (req, res, next) => {
  const headers = req.headers?.authorization;
  if (!headers) {
    throw new ApiError(401, "authentication headers required.");
  }
  const token = headers.split(" ")[1];
  if (!token) {
    throw new ApiError(401, "missing authorization token");
  }
  jwt.verify(token, config.jwt.secret, (error, payload) => {
    if (error) {
      if (error.name === "JsonWebToken") {
        throw new ApiError(401, "invalid jwt token");
      } else {
        throw new ApiError(401, error.message);
      }
    }
    req.payload = payload;
    next();
  });
});

export default { generateAccessToken, verifyAccessToken };
