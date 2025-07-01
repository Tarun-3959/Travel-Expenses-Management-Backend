const { Router } = require("express");
const {
  createExpense,
  getExpensesByTrip,
  updateExpense,
  deleteExpense,
} = require("../controllers/expense.controller");
const {
  tokenValidationMW,
  verifyTripOwnershipMW,
} = require("../middlewares/auth.middleware");
const expenseRouter = Router();

expenseRouter.post(
  "/:id",
  tokenValidationMW,
  verifyTripOwnershipMW,
  createExpense
);
expenseRouter.get(
  "/:id",
  tokenValidationMW,
  verifyTripOwnershipMW,
  getExpensesByTrip
);
expenseRouter.put(
  "/:id/:expenseId",
  tokenValidationMW,
  verifyTripOwnershipMW,
  updateExpense
);
expenseRouter.delete(
  "/:id/:expenseId",
  tokenValidationMW,
  verifyTripOwnershipMW,
  deleteExpense
);

module.exports = expenseRouter;
