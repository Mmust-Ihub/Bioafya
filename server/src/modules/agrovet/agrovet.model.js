import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const geoSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["Point", "LineString", "Polygon"],
    default: "Point",
    trim: true,
  },
  coordinates: {
    type: [Number],
    required: true,
    index: "2dsphere",
  },
});

const agrovetSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    subscribed: {
      type: Boolean,
      default: false,
    },
    location: geoSchema,
    joined: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

agrovetSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

agrovetSchema.statics.isNumberTaken = async function (phone_number, excludeUserId) {
  const user = await this.findOne({phone_number, _id: { $ne: excludeUserId } });
  return !!user;
};

agrovetSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

agrovetSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const agrovetModel = mongoose.model("Agrovet", agrovetSchema)
export default agrovetModel;
