import { config } from "dotenv";
import path, { dirname } from "path";
import joi from "joi";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = joi
  .object()
  .keys({
    NODE_ENV: joi
      .string()
      .valid("production", "development", "testing")
      .required(),
    PORT: joi.number().default(3000),
    MONGODB_URL: joi.string().required().description("Mongo db url"),
    MONGODB_NAME: joi.string().required().description("Mongo db url"),
    JWT_SECRET: joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_SECONDS: joi
      .number()
      .default(86400)
      .description("minutes after which access tokens expire"),
    MPESA_BASE_URL: joi.string().required().description("Mpesa base url"),
    MPESA_CONSUMER_KEY: joi.string().required().description("Mpesa consumer key"),
    MPESA_CONSUMER_SECRET: joi.string().required().description("Mpesa consumer secret"),
    MPESA_PASS_KEY: joi.string().required().description("Mpesa pass key"),
    MPESA_SHORT_CODE: joi.string().required().description("Mpesa shortcode"),
    MPESA_TRANSACTION_TYPE: joi.string().required().description("Mpesa transaction type"),
    MPESA_CALLBACK_BASE_URL: joi.string().required().description("Mpesa callback base url"),
    SUBSCRIPTION_AMOUNT: joi.string().required().description("Default subscription amount"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL,
    name: envVars.MONGODB_NAME,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationSeconds: envVars.JWT_ACCESS_EXPIRATION_SECONDS,
  },
  mpesa: {
    base_url: envVars.MPESA_BASE_URL,
    consumer_key: envVars.MPESA_CONSUMER_KEY,
    consumer_secret: envVars.MPESA_CONSUMER_SECRET,
    pass_key: envVars.MPESA_PASS_KEY,
    short_code: envVars.MPESA_SHORT_CODE,
    transaction_type: envVars.MPESA_TRANSACTION_TYPE,
    callback_url: envVars.MPESA_CALLBACK_BASE_URL,
    subscription_amount: envVars.SUBSCRIPTION_AMOUNT
  }
};
