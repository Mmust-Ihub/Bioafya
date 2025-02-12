import joi from "joi"

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

  export default { registerSchema, loginSchema }