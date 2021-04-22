const { Category , Service } = require("../../db/models");

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
//++++++++++++++++ Service +++++++++++++++++++++++++++++++++++//

// Create service
exports.createService = async (req, res, next) => {
  const salonId = req.user.id;
  const { categoryId } = req.params;
  try {
    // foundCategory: CHACK IF CATEGORY EXIST OR NOT "findOne"
    const foundCategory = await Category.findOne({
      where: {
        id: +categoryId,
        salonId: +salonId,
      }
    });
    // if Category EXIST && if salonID === salonId in the foundCategory
    if (foundCategory && req.user.id === salonId) {
      const checkService = await Service.findOne({
        where: {
          name: req.body.name,
        categoryId: categoryId
       },
      }); if (!checkService) {
        req.body.categoryId = categoryId;
        const newService = await Service.create(req.body);
        res.status(201).json(newService);
      } else {
        const err = new Error("This service already exist in your salon");
        err.status = 401;
        res.json({ message: err.message });
      }
      
   } else {
      const err = new Error("This categorey does not exist in this salon");
      err.status = 400;
      res.json({ message: err.message });
    }
  } catch (error) {
    next(error);
  }
};

// Categories List
exports.fetchSalonServices = async (req, res, next) => {
  const salonId = req.user.id;
  const { categoryId } = req.params;
  try {
    // foundCategory: CHACK IF CATEGORY EXIST OR NOT "findOne"
    const foundCategory = await Category.findOne({
      where: {
        id: +categoryId,
        salonId: +salonId,
      }
    });
    // if Category EXIST && if salonID === salonId in the foundCategory
    if (foundCategory && req.user.id === salonId) {
        const foundServices = await Service.findAll({
          where: {
            categoryId: categoryId,
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });
        if (foundServices) {
          res.json({ thisSalonServices: foundServices });
        } 
        // else {

        // }
    }
      
  } catch (error) {
    next(error);
  }
    }
