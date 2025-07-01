const { Router } = require("express");
const {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getAllCategory,
} = require("../controllers/trip.controller");
const tripRouter = Router();

tripRouter.post("/", createTrip);
tripRouter.get("/", getAllTrips);
tripRouter.get("/:id", getTripById);
tripRouter.get("/categories/:id", getAllCategory);
tripRouter.put("/:id", updateTrip);
tripRouter.delete("/:id", deleteTrip);

module.exports = tripRouter;
