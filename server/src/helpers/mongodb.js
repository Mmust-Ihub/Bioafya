import mongoose from "mongoose";
import config from "../config/config.js";
import logger from "../config/logger.js";

const connection = mongoose.connection;

export const connectToMongoDB = async () => {
  try {
    await mongoose.connect(config.mongoose.url, {
      dbName: config.mongoose.name,
    });
    logger.info("Connected to MongoDB successfully");

    connection.on("connected", () => {
      logger.info("Mongoose connected to mongodb");
    });

    connection.on("error", (error) => {
      logger.info(
        `Mongoose encountered an error while connectiong to mongodb: ${error.message}`
      );
    });

    connection.on("disconnected", () => {
      logger.info("Mongoose disconnected from mongoDB");
    });
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error.message);
  }
};

export const disconnectFromMongoDB = async () => {
  await mongoose.connection.close();
  logger.info("disconnected from mongodb ..");
  process.exit(0);
};
