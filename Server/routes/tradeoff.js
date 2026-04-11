import express from "express";
import Tradeoff from "../models/tradeoff.js";
import User from "../models/user.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/calculate", authMiddleware, async (req, res) => {
  try {
    const { price } = req.body;
    if (!price) {
      return res.status(400).json({ message: "Price is required" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hourlyRate = user.monthlyIncome / (user.workingHoursPerDay * user.workingDaysPerMonth);
    if (!hourlyRate || hourlyRate <= 0) {
      return res.status(400).json({ message: "Invalid income or work details" });
    }

    const hoursRequired = Number((price / hourlyRate).toFixed(2));
    const incomePercentage = Number(((price / user.monthlyIncome) * 100).toFixed(2));

    let impactLevel;
    if (hoursRequired < 2) impactLevel = "Low";
    else if (hoursRequired < 10) impactLevel = "Moderate";
    else impactLevel = "High";

    res.status(200).json({
      message: "Calculation successful",
      tradeoff: { hoursRequired, incomePercentage, impactLevel }
    });
  } catch (err) {
    res.status(500).json({ message: "Calculation failed", error: err.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { itemName, price, category, status } = req.body;

    if (!itemName || !price || !category) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }


    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Calculating hourly rate
    const hourlyRate =
      user.monthlyIncome /
      (user.workingHoursPerDay * user.workingDaysPerMonth);

    // Preventing divide-by-zero issues
    if (!hourlyRate || hourlyRate <= 0) {
      return res.status(400).json({
        message: "Invalid income or work details",
      });
    }

    // Calculating required hours and income percentage
    const hoursRequired = price / hourlyRate;
    const incomePercentage = (price / user.monthlyIncome) * 100;

    const roundedHours = Number(hoursRequired.toFixed(2));
    const roundedPercentage = Number(incomePercentage.toFixed(2));

    // Determining impact level
    let impactLevel;

    if (roundedHours < 2) {
      impactLevel = "Low";
    } else if (roundedHours < 10) {
      impactLevel = "Moderate";
    } else {
      impactLevel = "High";
    }

    // Creatingtradeoff record
    const tradeoff = await Tradeoff.create({
      itemName,
      price,
      category,
      hoursRequired: roundedHours,
      incomePercentage: roundedPercentage,
      impactLevel,
      status: status || "purchased",
      createdBy: req.userId,
    });

    res.status(201).json({
      message: "Tradeoff recorded successfully",
      tradeoff,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to create tradeoff",
      error: err.message,
    });
  }
});

router.get("/my", authMiddleware, async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Clean up expired pending tradeoffs
    await Tradeoff.deleteMany({
      createdBy: req.userId,
      status: "pending",
      createdAt: { $lt: twentyFourHoursAgo },
    });

    const Tradeoffs = await Tradeoff.find({ createdBy: req.userId }).sort({ createdAt: -1 });

    res.status(200).json({
    result: Tradeoffs,
    message: `This purchase costs you ${Tradeoffs[0]?.hoursRequired} hours of work`
  });

  }catch(err){
    res.status(500).json({
      msg: err
    })
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Tradeoff.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Tradeoff.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.userId },
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Tradeoff not found" });
    }

    res.json({ message: "Updated successfully", tradeoff: updated });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

export default router;