/* eslint-disable import/no-extraneous-dependencies */
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
//
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is Required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
      lowercase: true,
    },
    phone: String,
    profileImg: String,
    password: {
      type: String,
      required: [true, "Password is Required"],
      minlength: [6, "Too short Password"],
    },
    passwordChangetAt : Date,
    role: {
      type: String,
      enum: ["user", "seller",  "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    
  },
  { timestamps: true }
);

/* ---------------------- // Hashing the User Password on Create ---------------------- */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});




const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
