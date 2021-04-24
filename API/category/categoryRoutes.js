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
  fetchSalonCategories,
  categoryCreate,
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

// Get category by Id route
router.get(
  "/:categoryId",
  passport.authenticate("jwt", { session: false }),
  getCategoryById
);

// Update a category info
router.put(
  "/:categoryId",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  updateCategoryInfo
);

// Delete a category
router.delete(
  "/:categoryId",
  passport.authenticate("jwt", { session: false }),
  deleteCategory
);

// Get category in a salon
router.get(
  "/",
  // passport.authenticate("jwt", { session: false }),
  fetchSalonCategories
);

// Create new category in a salon
router.post(
  "/",
  upload.single("image"),
  passport.authenticate("jwt", { session: false }),
  categoryCreate
);

module.exports = router;
