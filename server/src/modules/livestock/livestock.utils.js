import joi from "joi";

export const livestockSchema = joi.object({
  name: joi.string().alphanum().min(3).max(30).required(),
  number: joi.number().required(),
});

export const detectAnomaly = (sensorData) => {
  const { ecg_value, temp, accel, gyro } = sensorData;

  // Define normal ranges (adjust based on real data)
  const normalRanges = {
    ecg: [800, 1800],
    temp: [36.5, 39],
    accel: [-1.5, 1.5],
    gyro: [-1.5, 1.5],
  };

  let anomalies = [];

  // ECG Anomaly
  if (ecg_value < normalRanges.ecg[0] || ecg_value > normalRanges.ecg[1]) {
    anomalies.push("ECG Abnormality Detected");
  }

  // Temperature Anomaly
  if (temp < normalRanges.temp[0] || temp > normalRanges.temp[1]) {
    anomalies.push("Temperature Out of Range");
  }

  // Accelerometer Anomaly (Movement detection)
  accel.forEach((axis) => {
    if (axis < normalRanges.accel[0] || axis > normalRanges.accel[1]) {
      anomalies.push("Abnormal Motion Detected");
    }
  });

  // Gyroscope Anomaly (Tremors, unusual rotation)
  gyro.forEach((axis) => {
    if (axis < normalRanges.gyro[0] || axis > normalRanges.gyro[1]) {
      anomalies.push("Unusual Gyroscope Movement");
    }
  });

  return anomalies.length
    ? { status: "ALERT", issues: anomalies }
    : { status: "NORMAL" };
};

