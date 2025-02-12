import { connectToMongoDB, disconnectFromMongoDB } from "./helpers/mongodb.js";
import app from "./app.js";
import config from "./config/config.js";
import logger from "./config/logger.js";


let server = app.listen(config.port, () => {
  connectToMongoDB()
  logger.info(`app is running on http://localhost:${config.port}`)
})

const exitHandler = () => {
  if (server){
    server.close()
    logger.info("server closed ...")
    process.exit(1)
  }else{
    process.exit(1)
  }
}

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);


process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  disconnectFromMongoDB()
  if (server) {
    server.close();
  }
});
