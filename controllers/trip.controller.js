const { default: mongoose } = require("mongoose");
const tripModel = require("../models/trip.model");

// CREATE a trip
const createTrip = async (req, res) => {
  try {
    const {
      tripName,
      destination,
      startDate,
      endDate,
      totalBudget,
      categories,
    } = req.body;
    if (!tripName || !destination || !startDate || !endDate || !totalBudget) {
      return res
        .status(400)
        .json({ errorMessage: "All required fields must be filled." });
    }

    const trip = await tripModel.create({
      createdBy: req.user.id,
      tripName,
      destination,
      startDate,
      endDate,
      totalBudget,
      categories,
    });

    res.status(201).json({ message: "Trip is Created", trip });
  } catch (error) {
    if (error._message == "Trip validation failed") {
      return res
        .status(400)
        .json({ errorMessage: "Please provide all fields or correct data." });
    }
    console.error("Create Trip Error:", error);
    res.status(500).json({ errorMessage: "Internal server error." });
  }
};

// GET all trips for the logged-in user
const getAllTrips = async (req, res) => {
  try {
    const trips = await tripModel.find({ createdBy: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ message: "All trips fetched successfully.", trips });
  } catch (error) {
    console.error("Get Trips Error:", error);
    res.status(500).json({ errorMessage: "Internal server error" });
  }
};

// GET a single trip by ID
const getTripById = async (req, res) => {
  try {
    const tripId = new mongoose.Types.ObjectId(req.params.id);
    const trip = await tripModel.findOne({
      _id: tripId,
      createdBy: req.user.id,
    });
    if (!trip) return res.status(404).json({ errorMessage: "Trip not found." });
    res.status(200).json({ message: "Trip fetched successfully.", trip });
  } catch (error) {
    if (
      error.message ==
      "input must be a 24 character hex string, 12 byte Uint8Array, or an integer"
    )
      return res.status(200).json({ message: "Trip not found", trip: {} });
    console.error("Get Trip Error:", error);
    res.status(500).json({ errorMessage: "Internal server error.", error });
  }
};

// UPDATE a trip
const updateTrip = async (req, res) => {
  try {
    let updatedData = {};
    console.log("req body:", req.body);
    if (req.body.newCategories) {
      updatedData.$push = { categories: { $each: req.body.newCategories } };
    }
    const otherUpdates = { ...req.body };
    delete otherUpdates.newCategories;
    if (Object.keys(otherUpdates).length > 0) {
      updatedData.$set = otherUpdates;
    }
    console.log(updatedData);
    const trip = await tripModel.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      updatedData,
      { new: true, runValidators: true }
    );

    if (!trip)
      return res
        .status(404)
        .json({ errorMessage: "Trip not found or unauthorized." });
    res.status(200).json({ message: "Trip is updated", trip });
  } catch (error) {
    if (error._message == "Trip validation failed") {
      return res
        .status(400)
        .json({ errorMessage: "Please provide correct data." });
    }
    console.error("Update Trip Error:", error);
    res.status(500).json({ errorMessage: "Server error updating trip." });
  }
};

// DELETE a trip
const deleteTrip = async (req, res) => {
  try {
    const trip = await tripModel.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!trip)
      return res
        .status(404)
        .json({ errorMessage: "Trip not found or unauthorized." });

    res.status(200).json({ message: "Trip deleted successfully." });
  } catch (error) {
    console.error("Delete Trip Error:", error);
    res.status(500).json({ errorMessage: "Internal server error." });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let categories = await tripModel.find(
      { _id: id, createdBy: req.user.id },
      { categories: 1, _id: 0 }
    );
    console.log("categories:", categories);
    categories = categories.map((category) => category.name);
    res.status(200).json({ message: "All Categories are fetched", categories });
  } catch (error) {
    console.log("error occured during fetching the categories:", error);
    res.status(500).json({ errorMessage: "Internal Server Error" });
  }
};

module.exports = {
  createTrip,
  getAllTrips,
  updateTrip,
  deleteTrip,
  getTripById,
  getAllCategory,
};
