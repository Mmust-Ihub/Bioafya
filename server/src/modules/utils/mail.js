import nodemailer from "nodemailer"
import config from "../../config/config.js";

export const sendAnomalyAlert = async (farmerEmail, sensorData, anomalies) =>  {
  const { ecg_value, temp, accel, gyro } = sensorData;

  // Email configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.mail.username,
      pass: config.mail.password,
    },
  });

  const subject = "🚨 Livestock Health Alert: Immediate Attention Required!";
  const body = `
    Dear Farmer,

    We have detected potential health anomalies in one of your livestock based on real-time monitoring data. Please review the details below:

    ⚠ Detected Anomalies:
    - ${anomalies.join("\n- ")}

    📊 Latest Sensor Readings:
    - ECG Value: ${ecg_value}
    - Temperature: ${temp}°C
    - Acceleration: ${accel.join(", ")}
    - Gyroscope: ${gyro.join(", ")}

    🔍 Recommended Actions:
    - Check the affected livestock for signs of illness or distress.
    - Ensure the animal is in a clean and stress-free environment.
    - Contact a veterinary expert if abnormalities persist.

    Early detection is key to preventing disease outbreaks and ensuring the well-being of your livestock.

    Best Regards,
    Bio_Afya Livestock Monitoring System
  `;

  // Send email
  transporter.sendMail(
    {
      from: config.mail.username,
      to: farmerEmail,
      subject: subject,
      text: body,
    },
    (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    }
  );
}