const { Router } = require("express");
const {
  getExpensesByCategoryForTrip,
  getBudgetVsSpent,
  getDailySpending,
} = require("../controllers/analysis.controller");

const {
  tokenValidationMW,
  verifyTripOwnershipMW,
} = require("../middlewares/auth.middleware");

const analysisRouter = Router();

analysisRouter.get(
  "/category-breakdown/:id",
  tokenValidationMW,
  verifyTripOwnershipMW,
  getExpensesByCategoryForTrip
);
analysisRouter.get(
  "/budget-vs-spent/:id",
  tokenValidationMW,
  verifyTripOwnershipMW,
  getBudgetVsSpent
);
analysisRouter.get(
  "/daily-spending/:id",
  tokenValidationMW,
  verifyTripOwnershipMW,
  getDailySpending
);

module.exports = analysisRouter;
