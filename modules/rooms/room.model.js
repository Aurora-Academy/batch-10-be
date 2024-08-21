const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;
const roomSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    createdBy: { type: ObjectId, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = new model("Room", roomSchema);
