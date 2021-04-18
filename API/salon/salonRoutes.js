// Imports
const express = require("express");
const router = express.Router();
const passport = require("passport");
const upload = require("../../middlewares/multer");

// Importing controllers
const {
  fetchSalon,
  addSalonAcc,
  signin,
  getTokenInfo,
  getSalonsList,
  updateSalon,
  getSalonById,
  deleteSalon,
} = require("./salonController");

// param middleware
router.param("salonId", async (req, res, next, salonId) => {
  const salon = await fetchSalon(salonId, next);
  if (salon) {
    req.salon = salon;
    next();
  } else {
    const error = new Error("No salon was found with this id");
    error.status = 404;
    next(error);
  }
});

// Sign up route
router.post("/addSalonAcc", upload.single("image"), addSalonAcc);

// Sign in route
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signin
);

// Decode token route
router.get(
  "/getTokenInfo",
  passport.authenticate("jwt", { session: false }),
  getTokenInfo
);

// Get all salons route
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getSalonsList
);

// Get salon by ID route
router.get(
  "/:salonId",
  passport.authenticate("jwt", { session: false }),
  getSalonById
);

// Update a salon info
router.put(
  "/:salonId",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  updateSalon
);

// Delete a salon
router.delete(
  "/:salonId",
  passport.authenticate("jwt", { session: false }),
  deleteSalon
);

module.exports = router;
