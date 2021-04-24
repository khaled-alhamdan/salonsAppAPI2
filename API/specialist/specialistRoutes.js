// Imports
const express = require("express");
const router = express.Router();
const passport = require("passport");
const upload = require("../../middlewares/multer");

// Importing controllers
const {
  fetchSpecialists,
  addSpecialistInSalon,
} = require("./specialistController");

// Get specialists in a salon
router.get(
  "/",
  // passport.authenticate("jwt", { session: false }),
  fetchSpecialists
);

// Create new specialist in a salon
router.post(
  "/",
  upload.single("image"),
  passport.authenticate("jwt", { session: false }),
  addSpecialistInSalon
);
module.exports = router;
