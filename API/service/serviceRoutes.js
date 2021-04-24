// Imports
const express = require("express");
const router = express.Router();
const passport = require("passport");

// Importing controllers
const {
  fetchService,
  createServiceInCategorey,
  getCategoryServices,
  getAllServices,
  updateService,
  deleteService,
  assignServiceToSpecialist,
  removeServiceFromSpecialist,
} = require("./serviceController");

// param middleware
router.param("serviceId", async (req, res, next, serviceId) => {
  const service = await fetchService(serviceId, next);
  if (service) {
    req.service = service;
    next();
  } else {
    const error = new Error("No service was found with this id");
    error.status = 404;
    next(error);
  }
});

//Create Service in a category
router.post(
  "/:categoryId",
  passport.authenticate("jwt", { session: false }),
  createServiceInCategorey
);

//Assign Service to specialist
router.post(
  "/:serviceId/:specialistId",
  passport.authenticate("jwt", { session: false }),
  assignServiceToSpecialist
);

//Remove Service from a specialist
router.delete(
  "/:serviceId/:specialistId",
  passport.authenticate("jwt", { session: false }),
  removeServiceFromSpecialist
);

// All services List
router.get(
  "/",
  //   passport.authenticate("jwt", { session: false }),
  getAllServices
);

// Category services List
router.get(
  "/:categoryId",
  //   passport.authenticate("jwt", { session: false }),
  getCategoryServices
);

// Update a service info
router.put(
  "/:serviceId",
  passport.authenticate("jwt", { session: false }),
  updateService
);

// Delete a service
router.delete(
  "/:serviceId",
  passport.authenticate("jwt", { session: false }),
  deleteService
);

module.exports = router;
