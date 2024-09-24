const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;
const roomSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    created_by: { type: ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["single", "double", "suite"],
      default: "double",
    },
    price: {
      type: Number,
      min: [750, "Minimum room price is 750"],
      max: [10000, "Minimum room price is 750"],
    },
    status: {
      type: String,
      enum: ["empty", "booked", "occupied"],
      default: "empty",
    },
    totalGuests: {
      type: Number,
      min: [1, "Minimum accomodation is 1"],
      max: [5, "Maximum accomodation is 5"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = new model("Room", roomSchema);
