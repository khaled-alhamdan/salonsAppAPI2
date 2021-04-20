const { Category } = require("../../db/models");

exports.fetchCategory = async (categoryId, next) => {
  try {
    const category = await Category.findByPk(categoryId);
    return category;
  } catch (error) {
    next(error);
  }
};

// Get category by its id
exports.getCategoryById = async (req, res, next) => {
  const { categoryId } = req.params;
  const { salonId } = req.params;
  try {
    // if (
    //   (req.user.id === +salonId && req.user.role === "salon") ||
    //   req.user.role === "admin"
    // ) {
    const foundCategory = await Category.findOne({
      where: {
        id: +categoryId,
        salonId: +salonId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });
    if (foundCategory) {
      res.status(200).json({ foundCategory: foundCategory });
    } else {
      const err = new Error("This categorey does not exist in this salon");
      err.status = 400;
      res.json({ message: err.message });
    }
    // } else {
    //   res.status(400).json({
    //     message:
    //       "Only app admins and this salon manager can view this salon categories",
    //   });
    // }
  } catch (error) {
    next(error);
  }
};

// Updating category info controller
exports.updateCategoryInfo = async (req, res, next) => {
  const { salonId } = req.params;
  const { categoryId } = req.params;
  try {
    if (req.user.id === +salonId && req.user.role === "salon") {
      if (req.file) {
        req.body.image = `/media/${req.file.filename}`;
      }
      const checkCategory = await Category.findOne({
        where: {
          id: +categoryId,
          salonId: +salonId,
        },
      });
      if (checkCategory) {
        await checkCategory.update(req.body);
        res.status(200).json({ message: "Category info has been updated" });
      } else {
        const err = new Error(
          "This categoriy can only be updated by its salon manager"
        );
        err.status = 400;
        res.json({ message: err.message });
      }
    } else {
      res.status(400).json({
        message: "Only this salon manager can update this salon info",
      });
    }
  } catch (error) {
    next(error);
  }
};

// Deleting a category
exports.deleteCategory = async (req, res, next) => {
  const { salonId } = req.params;
  const { categoryId } = req.params;
  try {
    if (req.user.id === +salonId && req.user.role === "salon") {
      const checkCategory = await Category.findOne({
        where: {
          id: +categoryId,
          salonId: +salonId,
        },
      });
      if (checkCategory) {
        await checkCategory.destroy(req.body);
        res.status(200).json({ message: "Category has been deleted" });
      } else {
        const err = new Error("This categorey does not exist in this salon");
        err.status = 400;
        res.json({ message: err.message });
      }
    } else {
      res.status(400).json({
        message:
          "Only this salon manager can delete categories from this salon",
      });
    }
  } catch (error) {
    next(error);
  }
};
