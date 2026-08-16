import mongoose from "mongoose";

const tradeoffSchema = new mongoose.Schema(
  {
    itemName: String,
    price: Number,
    category: {
      type: String,
      enum: ["need", "want", "luxury"],
    },
    hoursRequired: Number,
    incomePercentage: Number,
    impactLevel: String,
    status: {
      type: String,
      enum: ["purchased", "pending"],
      default: "purchased",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

tradeoffSchema.index({
  createdBy: 1,
  createdAt: -1,
});

export default mongoose.model("Tradeoff", tradeoffSchema);
