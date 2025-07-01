const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tripName: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  totalBudget: {
    type: Number,
    min: 0,
    max: 10000000,
    required: true,
  },
  categories: [
    {
      name: {
        type: String,
        required: true,
      },
      budget: {
        type: Number,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const tripModel = mongoose.model("Trip", tripSchema);
module.exports = tripModel;
