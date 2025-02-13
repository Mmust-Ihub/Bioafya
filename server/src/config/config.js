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

    MAX_VET_DISTANCE: joi.string().required().description("The maximum veterinary"),
    MAX_VET_LIMIT: joi.string().required().description("The maximum veterinary limit"),

    FIREBASE_COLL: joi.string().required().description("Firebase collection"),

    MPESA_BASE_URL: joi.string().required().description("Mpesa base url"),
    MPESA_CONSUMER_KEY: joi.string().required().description("Mpesa consumer key"),
    MPESA_CONSUMER_SECRET: joi.string().required().description("Mpesa consumer secret"),
    MPESA_PASS_KEY: joi.string().required().description("Mpesa pass key"),
    MPESA_SHORT_CODE: joi.string().required().description("Mpesa shortcode"),
    MPESA_TRANSACTION_TYPE: joi.string().required().description("Mpesa transaction type"),
    MPESA_CALLBACK_BASE_URL: joi.string().required().description("Mpesa callback base url"),
    SUBSCRIPTION_AMOUNT: joi.string().required().description("Default subscription amount"),

    CLOUDINARY_CLOUD_NAME: joi.string().required().description("Cloudinary cloud name"),
    CLOUDINARY_API_KEY: joi.string().required().description("Cloudinary api key"),
    CLOUDINARY_API_SECRET: joi.string().required().description("Cloudinary api secret"),

    GEMINI_API_KEY: joi.string().required().description("Gemini api key"),
    GEMINI_MODEL: joi.string().required().description("Gemini model name"),

    MAIL_USERNAME: joi.string().required().description("Mail username"),
    MAIL_PASSWORD: joi.string().required().description("Mail password"),
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
  vet: {
    distance: envVars.MAX_VET_DISTANCE,
    limit: envVars.MAX_VET_LIMIT,
    coll: envVars.FIREBASE_COLL
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
  },
  cloudinary: {
    name: envVars.CLOUDINARY_CLOUD_NAME,
    key: envVars.CLOUDINARY_API_KEY,
    secret: envVars.CLOUDINARY_API_SECRET
  },
  gemini: {
    api_key: envVars.GEMINI_API_KEY,
    model: envVars.GEMINI_MODEL
  },
  mail: {
    username: envVars.MAIL_USERNAME,
    password: envVars.MAIL_PASSWORD
  }
};
