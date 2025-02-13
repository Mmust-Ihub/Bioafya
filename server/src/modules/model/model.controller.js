import httpStatus from "http-status";
import { catchAsync } from "../utils/catchAsync.js";
import { diseaseObject } from "./prompt.js";
import config from "../../config/config.js";
import { uploadImage } from "../utils/uploadImage.js";
import { modelPredict } from "./model.js";
import userModel from "../user/user.model.js";
import agrovetUtils from "../agrovet/agrovet.utils.js";

const predictDisease = catchAsync(async (req, res, next) => {
  const file = req.files[0];
  const [imageResponse, predictResponse] = await Promise.all([
    uploadImage(file),
    modelPredict(file.buffer, file.mimetype, diseaseObject),
  ]);
  if (Object.keys(predictResponse).length > 0) {
    const data = {
      ...predictResponse,
      image_url: imageResponse,
      user_id: req.payload.aud,
    };
    // await diseaseModel.create(data)
    const { location } = await userModel.findById(req.payload.aud);
    const nearbyVets = await agrovetUtils.getNearbyVets(location)
    console.log({...data, ...{"nearbyVets": nearbyVets}})
    return res.status(httpStatus.OK).json({...data, ...{"nearbyVets": nearbyVets}});
  } else {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ status: "failed", message: "No disease detected" });
  }
});

export default { predictDisease, };
