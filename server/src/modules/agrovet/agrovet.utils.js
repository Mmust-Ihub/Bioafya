import joi from "joi";
import agrovetModel from "./agrovet.model.js";
import config from "../../config/config.js";

const registerSchema = joi.object({
  username: joi.string().alphanum().min(3).max(30).required(),
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  phone_number: joi.string().required(),
  confirm_password: joi.ref("password"),
  location: joi.object().keys({
    type: joi.string().default("Point"),
    coordinates: joi.array().items(),
  }),
});

const loginSchema = joi.object({
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

const getNearbyVets = async (farmerLocation) => {
  const vets = await agrovetModel
    .find(
      {
        location: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: farmerLocation.coordinates,
            },
            $maxDistance: config.vet.distance,
            $minDistance: 0,
          },
        },
      },
      {
        username: 1,
        email: 1,
        phone_number: 1,
      }
    )
    .limit(config.vet.limit);
  return vets;
};

export default { registerSchema, loginSchema, getNearbyVets };
