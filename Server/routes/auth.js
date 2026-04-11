import express, { json } from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      monthlyIncome,
      workingHoursPerDay,
      workingDaysPerMonth,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const NewUser = new User({
      name: name,
      email: email,
      password: hash,
      monthlyIncome: monthlyIncome,
      workingHoursPerDay: workingHoursPerDay,
      workingDaysPerMonth: workingDaysPerMonth,
    });
    await NewUser.save();
    res.status(201).json({
      message: "user registered!",
    });
  } catch (err) {
    res.status(400).json({
      message: "Registration failed",
      error: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    res.status(400).json({
      message: "login failed",
      error: err.message,
    });
  }
});

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password -__v");
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: "Error fetching profile" });
  }
});



export default router;
