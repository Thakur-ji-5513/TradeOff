import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  monthlyIncome: {
    type: Number,
    required: true,
  },
  workingHoursPerDay: {
    type: Number,
    required: true,
  },
  workingDaysPerMonth: {
    type: Number,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
