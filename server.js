const express = require("express");
const cors = require("cors");

const connectToDB = require("./config/configDB");
const authRouter = require("./routes/auth.route");
const tripRouter = require("./routes/trip.route");

const { tokenValidationMW } = require("./middlewares/auth.middleware");
const expenseRouter = require("./routes/expense.route");
const analysisRouter = require("./routes/anaylysis.route");
const app = express();
app.use(cors());
app.use(express.json());

// Main routes
app.use("/auth", authRouter);
app.use("/trips", tokenValidationMW, tripRouter); //no need of verifyTripOwnershipMW
app.use("/expenses", expenseRouter);
app.use("/analysis", analysisRouter);

// testing route
app.use("/test", (req, res) => {
  res.send("Test route is working");
});

// handeling uncreated route
app.use((req, res) => {
  res.status(404).json({ errorMessage: "Page not found" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  connectToDB();
});
