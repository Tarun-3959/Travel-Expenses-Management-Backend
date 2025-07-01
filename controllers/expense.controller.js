const expenseModel = require("../models/expense.model");
const tripModel = require("../models/trip.model");

// CREATE an expense
const createExpense = async (req, res) => {
  try {
    const tripId = req.params.id;
    const { category, amount, description, date } = req.body;
    if (!tripId || !category || !amount || !date) {
      return res
        .status(400)
        .json({ errorMessage: "All required fields must be filled." });
    }
    const expense = await expenseModel.create({
      tripId,
      category,
      amount,
      description,
      date,
    });

    res.status(201).json({ message: "expense is created", expense });
  } catch (error) {
    console.error("Create Expense Error:", error);
    res.status(500).json({ errorMessage: "Internal server error." });
  }
};

// GET all expenses for a trip
const getExpensesByTrip = async (req, res) => {
  try {
    console.log("tripId:", req.params.id);
    const tripId = req.params.id;
    const expenses = await expenseModel.find({ tripId }).sort({ date: -1 });
    res.status(200).json({ message: "expenses are fetched", expenses });
  } catch (error) {
    console.error("Get Expenses Error:", error);
    res.status(500).json({ errorMessage: "Server error fetching expenses." });
  }
};

// UPDATE an expense
const updateExpense = async (req, res) => {
  try {
    console.log("**************");
    console.log("tripId:", req.params.id);
    console.log("expenseId:", req.params.expenseId);
    const expense = await expenseModel.findByIdAndUpdate(
      req.params.expenseId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!expense)
      return res.status(404).json({ errorMessage: "Expense not found." });
    res.status(200).json({ message: "expense is updated", expense });
  } catch (error) {
    console.error("Update Expense Error:", error);
    res.status(500).json({ errorMessage: "Internal server error." });
  }
};

// DELETE an expense
const deleteExpense = async (req, res) => {
  try {
    const expense = await expenseModel.findByIdAndDelete(req.params.expenseId);
    if (!expense)
      return res.status(404).json({ errorMessage: "Expense not found." });

    res.status(200).json({ message: "Expense deleted successfully." });
  } catch (error) {
    console.error("Delete Expense Error:", error);
    res.status(500).json({ errorMessage: "Internal server error" });
  }
};

module.exports = {
  createExpense,
  getExpensesByTrip,
  updateExpense,
  deleteExpense,
};
