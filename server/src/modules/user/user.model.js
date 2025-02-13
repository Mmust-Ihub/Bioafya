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
  },
});

const userSchema = new mongoose.Schema(
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
    location: {
      type: geoSchema,
      required: true,
      index: "2dsphere",
    },
    joined: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.statics.isNumberTaken = async function (phone_number, excludeUserId) {
  const user = await this.findOne({phone_number, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const userModel = mongoose.model("User", userSchema)
export default userModel;
