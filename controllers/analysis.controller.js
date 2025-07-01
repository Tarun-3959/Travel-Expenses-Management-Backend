const mongoose = require("mongoose");

const expenseModel = require("../models/expense.model");
const tripModel = require("../models/trip.model");

const getExpensesByCategoryForTrip = async (req, res) => {
  try {
    const tripId = new mongoose.Types.ObjectId(req.params.id);
    console.log("tripId:", tripId);
    // Aggregate expenses per category
    const breakdown = await expenseModel.aggregate([
      { $match: { tripId: tripId } },
      {
        $group: {
          _id: "$category",
          totalSpent: { $sum: "$amount" },
        },
      },
      { $sort: { totalSpent: -1 } },
    ]);

    console.log("breakdown:", breakdown);

    const totalSpent = breakdown.reduce(
      (acc, curr) => acc + curr.totalSpent,
      0
    );

    res.status(200).json({
      message: "expenses are fetched by category",
      totalSpent,
      breakdown: breakdown.map((item) => ({
        category: item._id,
        totalSpent: item.totalSpent,
      })),
    });
  } catch (error) {
    console.error("Category Breakdown Error:", error);
    res.status(500).json({ errorMessage: "Internal server error" });
  }
};

const getBudgetVsSpent = async (req, res) => {
  try {
    const tripId = new mongoose.Types.ObjectId(req.params.id);
    const trip = await tripModel.findById(tripId);
    if (!trip) {
      return res.status(404).json({ errorMessage: "Trip not found" });
    }

    // Group expenses by category
    const spentData = await expenseModel.aggregate([
      { $match: { tripId: trip._id } },
      { $group: { _id: "$category", totalSpent: { $sum: "$amount" } } },
    ]);

    // Build budget vs spent array
    const result = trip.categories.map((cat) => {
      const match = spentData.find(
        (s) => s._id.toLowerCase() === cat.name.toLowerCase()
      );
      return {
        category: cat.name,
        budget: cat.budget,
        spent: match ? match.totalSpent : 0,
      };
    });

    res
      .status(200)
      .json({ message: "Budget and spent expenses are fetched", data: result });
  } catch (err) {
    console.error("Budget vs Spent Error:", err);
    res.status(500).json({ errorMessage: "Internal server error" });
  }
};

const getDailySpending = async (req, res) => {
  try {
    const tripId = new mongoose.Types.ObjectId(req.params.id);
    const trip = await tripModel.findById(tripId);
    if (!trip) {
      return res.status(404).json({ errorMessage: "Trip not found" });
    }

    const dailySpending = await expenseModel.aggregate([
      { $match: { tripId: trip._id } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          totalSpent: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      message: "Daily expenses are fetched",
      data: dailySpending.map((entry) => ({
        date: entry._id,
        spent: entry.totalSpent,
      })),
    });
  } catch (err) {
    console.error("Daily Spending Error:", err);
    res.status(500).json({ errorMessage: "Internal server error" });
  }
};

module.exports = {
  getExpensesByCategoryForTrip,
  getBudgetVsSpent,
  getDailySpending,
};
