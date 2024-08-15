const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
    image: String,
    roles: { type: [String], enum: ["admin", "user"], default: ["user"] },
    isActive: { type: Boolean, required: true, default: false },
    isBlocked: { type: Boolean, required: true, default: false },
    token: String,
  },
  {
    timestamps: true,
  }
);

module.exports = new model("User", schema);
