const { randomUUID } = require("crypto");
const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const orderSchema = new Schema(
  {
    number: {
      type: String,
      default: () => String(randomUUID()),
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },

    arrivalDate: { type: Date, required: true },
    departureDate: { type: Date, required: true },
    rooms: [
      {
        room: { type: ObjectId, ref: "Room", required: true },
        price: { type: Number, required: true },
        amount: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["paid", "unpaid", "refund"],
      default: "unpaid",
    },
    amount: { type: Number, required: true },
    created_by: { type: ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = new model("Order", orderSchema);
