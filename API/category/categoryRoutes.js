// Imports
const express = require("express");
const router = express.Router();
const passport = require("passport");
const upload = require("../../middlewares/multer");

// Importing controllers
const {
  fetchCategory,
  updateCategoryInfo,
  getCategoryById,
  deleteCategory,
  createService,
  fetchSalonServices,
} = require("./categoryController");

// param middleware
router.param("categoryId", async (req, res, next, categoryId) => {
  const category = await fetchCategory(categoryId, next);
  if (category) {
    req.category = category;
    next();
  } else {
    const error = new Error("No category was found with this id");
    error.status = 404;
    next(error);
  }
});

// Get category by ID route
router.get(
  "/:salonId/:categoryId",
  passport.authenticate("jwt", { session: false }),
  getCategoryById
);

// Update a category info
router.put(
  "/:salonId/:categoryId",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  updateCategoryInfo
);

// Delete a category
router.delete(
  "/:salonId/:categoryId",
  passport.authenticate("jwt", { session: false }),
  deleteCategory
);

//Create Service
router.post("/:categoryId/services",
passport.authenticate("jwt", { session: false }),
 createService)

 // Service List
 router.get("/:categoryId",
 passport.authenticate("jwt", { session: false }),
 fetchSalonServices)

module.exports = router;
