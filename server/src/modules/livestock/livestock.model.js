import mongoose, { mongo } from "mongoose";

const livestockSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    number: {
      type: Number,
      required: true,
      unique: true,
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const sensorDataSchema = new mongoose.Schema(
  {
    ecg_value: Number,
    accel: [Number],
    temp: Number,
    timestamp: { type: Date, default: Date.now },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    livestockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Livestock", // Reference to the Group schema
      required: true,
    },
  },
  { timestamps: true }
);

export const livestockModel = mongoose.model("Livestock", livestockSchema);
export const sensorDataModel = mongoose.model("SensorData", sensorDataSchema);
