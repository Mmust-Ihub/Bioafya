import { catchAsync } from "../utils/catchAsync.js";
import httpStatus from "http-status";
import utils from "./agrovet.utils.js";
import { ApiError } from "../utils/APiError.js";
import agrovetModel from "./agrovet.model.js";
import jwt from "../../helpers/jwt.js";
import mpesa from "../mpesa/mpesa.js";

const registerAgrovet = catchAsync(async (req, res, next) => {
  const userBody = req.body;
  console.log(userBody)
  const result = utils.registerSchema.validate(userBody);
  if (result.error) {
    throw new ApiError(400, result.error.details[0].message);
  }
  if (await agrovetModel.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "email is already taken ...");
  }
  if (await agrovetModel.isNumberTaken(userBody.phone_number)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "phone number is already taken ..."
    );
  }
  await agrovetModel.create(userBody);
  return res.status(200).json({
    status: "success",
    message: "user registerd successfully",
  });
});

const subscribeAgrovet = catchAsync(async (req, res, next) => {
    const { phone_number } = req.body;
    if (!phone_number) {
      throw new ApiError(400, "Phone number is required");
    }
    const user = await agrovetModel.findOne({ phone_number });
    if (!user) {
      throw new ApiError(401, "Phone number not registered");
    }
    await mpesa.initiateStkPush(phone_number)
    await agrovetModel.findOneAndUpdate(
      { phone_number: phone_number},
      { $set: { subscribed: true } },
      { new: true }
    );
    // {new: true} -> returns the updated version of the document
    return res.status(202).json({
      status: "success. account subscribed successfully.",
    });
});

const loginAgrovet = catchAsync(async (req, res, next) => {
  const result = utils.loginSchema.validate(req.body);
  if (result.error) {
    throw new ApiError(400, result.error.details[0].message);
  }
  const { email, password } = req.body;
  const user = await agrovetModel.findOne({ email});
  if (!user || !await user.isPasswordMatch(password)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }
  if (!user.subscribed) {
    throw new ApiError(httpStatus.BAD_REQUEST, "please subscribe");
  }
  const token = await jwt.generateAccessToken({
    email: email,
    userID: user.id,
  });
  return res.status(200).json({
    status: "success",
    access_token: token,
    vetId: user.id
  });
});

export default { registerAgrovet, subscribeAgrovet, loginAgrovet };
