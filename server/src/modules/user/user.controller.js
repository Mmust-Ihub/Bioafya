import { catchAsync } from "../utils/catchAsync.js";
import httpStatus from "http-status";
import userUtils from "./user.utils.js";
import { ApiError } from "../utils/APiError.js";
import userModel from "./user.model.js";
import jwt from "../../helpers/jwt.js";
import db from "../../helpers/firebase.js";
import config from "../../config/config.js";

const registerUser = catchAsync(async (req, res, next) => {
  const userBody = req.body;
  const result = userUtils.registerSchema.validate(userBody);
  if (result.error) {
    throw new ApiError(400, result.error.details[0].message);
  }
  if (await userModel.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "email is already taken ...");
  }
  if (await userModel.isNumberTaken(userBody.phone_number)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "phone number is already taken ..."
    );
  }
  await userModel.create(userBody);
  return res.status(201).json({
    status: "success",
    message: "user registerd successfully",
  });
});

const loginUser = catchAsync(async (req, res, next) => {
  const result = userUtils.loginSchema.validate(req.body);
  if (result.error) {
    throw new ApiError(400, result.error.details[0].message);
  }
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }
  const token = await jwt.generateAccessToken({
    email: email,
    userID: user.id,
  });
  return res.status(200).json({
    status: "success",
    access_token: token,
  });
});

const userProfile = catchAsync(async (req, res) => {
  const id = req.payload.aud;
  const user = await userModel.findById(id, { username: 1, email: 1, _id: 0, phone_number: 1 });
  return res.status(200).json(user);
});

const selectVet = catchAsync(async(req, res, next ) => {
  const {vetId, animal, disease, image_url } = req.body
  const  userData = await userModel.findById(req.payload.aud, {username: 1, phone_number: 1, location: 1, _id: 0}).lean()
// Convert location._id to a string
if (userData.location && userData.location._id) {
  userData.location._id = userData.location._id.toString();
}
  const data = {...userData, vetId, animal, disease, image_url}
// upload data to firebase firestore
  await db.collection(config.vet.coll).add(data)
  return res.status(200).json({"success": "data uploaded to firebase successfully."})

})

export default { registerUser, loginUser, userProfile, selectVet };
