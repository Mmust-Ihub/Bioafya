import { catchAsync } from "../utils/catchAsync.js";
import { ApiError } from "../utils/APiError.js";
import { detectAnomaly, livestockSchema } from "./livestock.utils.js";
import { livestockModel, sensorDataModel } from "./livestock.model.js";
import { sendAnomalyAlert } from "../utils/mail.js";
import db from "../../helpers/firebase.js";

const createLivestock = catchAsync(async (req, res, next) => {
  const result = livestockSchema.validate(req.body);
  if (result.error) {
    throw new ApiError(400, result.error.details[0].message);
  }
  const farmerId = req.payload.aud;
  await livestockModel.create({ ...req.body, farmerId });
  return res.status(201).json({ success: "livestock added successfully." });
});

const getLivestock = catchAsync(async (req, res) => {
  const data = await livestockModel.find({ farmerId: req.payload.aud });
  return res.status(200).json(data);
});

const ingest = catchAsync(async (req, res) => {
  const { ecg_value, accel, temp, gyro, number } = req.body;
  // upload to firestore
  const docRef = db.collection("livestock").doc(number);
  docRef.set({ ecg_value, accel, temp, gyro, number });

  const anomaly = detectAnomaly(req.body);
  if (anomaly.status === "ALERT") {
    sendAnomalyAlert("antonygichoya9@gmail.com", req.body, anomaly.issues)
  }
  const livestock = await livestockModel.findOne({ number });
  const newData = {
    ecg_value,
    accel,
    temp,
    gyro,
    farmerId: livestock.farmerId,
    livestockId: livestock.id,
  };
  // await sensorDataModel.create(newData)
  return res
    .status(201)
    .json({ status: "success", message: "sensor data stored successfully" });
});

export default { createLivestock, getLivestock, ingest };
