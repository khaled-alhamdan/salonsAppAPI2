const { Salon, Category, User } = require("../../db/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRATION_MS } = require("../../db/config/keys");

exports.fetchSalon = async (salonId, next) => {
  try {
    const salon = await Salon.findByPk(salonId);
    return salon;
  } catch (error) {
    next(error);
  }
};

// Adding new salon controller
exports.addSalonAcc = async (req, res, next) => {
  const { password } = req.body;
  const saltRounds = 10;
  try {
    if (req.user.role === "admin") {
      if (req.file) {
        req.body.image = `media/${req.file.filename}`;
      }
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      req.body.password = hashedPassword;
      const newSalon = await Salon.create({ ...req.body, role: "salon" });
      const payload = {
        id: newSalon.id,
        username: newSalon.username,
        gender: newSalon.gender,
        role: newSalon.role,
        exp: Date.now() + parseInt(JWT_EXPIRATION_MS),
      };
      const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
      res.status(201).json({ token: token });
    } else {
      res.status(400).json({ message: "Only admins can add new salons" });
    }
  } catch (error) {
    next(error);
  }
};

// Salons sign in controller
exports.signin = (req, res, next) => {
  try {
    const { user } = req;
    const payload = {
      id: user.id,
      username: user.username,
      gender: user.gender,
      role: user.role,
      exp: Date.now() + parseInt(JWT_EXPIRATION_MS),
    };
    const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
    res.json({ token: token });
  } catch (error) {
    next(error);
  }
};

// Get token info controller
exports.getTokenInfo = (req, res, next) => {
  res.json(req.user);
};

// Salons list controller
exports.getSalonsList = async (req, res) => {
  try {
    // if (req.user.role === "admin") {
    const salons = await Salon.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });
    res.json(salons);
    // } else {
    //   res.status(400).json("Only admins can view salons list");
    // }
  } catch (error) {
    res.status(500).json("No salons found");
  }
};

// Get salon by its id
exports.getSalonById = async (req, res, next) => {
  const { salonId } = req.params;
  try {
    // if (
    //   (req.user.id === +salonId && req.user.role === "salon") ||
    //   req.user.role === "admin"
    // ) {
    const foundSalon = await Salon.findByPk(salonId, {
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });
    res.status(200).json({ foundSalon });
    // } else {
    //   res.status(400).json({
    //     message:
    //       "Only app admins and this salon manager can view this salon info",
    //   });
    // }
  } catch (error) {
    next(error);
  }
};

// Updating salon info controller
exports.updateSalon = async (req, res, next) => {
  const { salonId } = req.params;
  try {
    if (req.user.id === +salonId && req.user.role === "salon") {
      if (req.file) {
        req.body.image = `/media/${req.file.filename}`;
        // req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
      }
      await req.salon.update(req.body);
      res.status(200).json({ message: "Salon info has been updated" });
    } else {
      res.status(400).json({
        message: "Only this salon manager can update this salon info",
      });
    }
  } catch (error) {
    next(error);
  }
};

// Deleting a salon
exports.deleteSalon = async (req, res, next) => {
  const { salonId } = req.params;
  try {
    if (
      (req.user.id === +salonId && req.user.role === "salon") ||
      req.user.role === "admin"
    ) {
      await req.salon.destroy(req.body);
      res.status(200).json({ message: "Salon account has been deleted" });
    } else {
      res.status(400).json({
        message:
          "Only app admins or this salon manager can delete this salon account",
      });
    }
  } catch (error) {
    next(error);
  }
};

// Create new category in a salon
exports.categoryCreate = async (req, res, next) => {
  const { salonId } = req.params;
  try {
    if (req.user.id === +salonId && req.user.role === "salon") {
      if (req.file) {
        req.body.image = `/media/${req.file.filename}`;
      }
      const checkCategory = await Category.findOne({
        where: {
          name: req.body.name,
          salonId: salonId,
        },
      });
      if (!checkCategory) {
        req.body.salonId = req.user.id;
        const newCategory = await Category.create(req.body);
        res.status(201).json(newCategory);
      } else {
        const err = new Error("This category already exist in your salon");
        err.status = 401;
        res.json({ message: err.message });
      }
    } else {
      const err = new Error("Only this salon manager can add new categories");
      err.status = 401;
      res.json({ message: err.message });
    }
  } catch (error) {
    next(error);
  }
};

// Salon's categories list controller
exports.fetchSalonCategories = async (req, res, next) => {
  const { salonId } = req.params;
  try {
    const foundCatergories = await Category.findAll({
      where: {
        salonId: salonId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });
    if (foundCatergories) {
      res.json({ thisSalonCatergories: foundCatergories });
    }
  } catch (error) {
    next(error);
  }
};

// Add new specialist in a salon
exports.addSpecialistInSalon = async (req, res, next) => {
  const { salonId } = req.params;
  const { password } = req.body;
  const saltRounds = 10;
  try {
    if (req.user.id === +salonId && req.user.role === "salon") {
      if (req.file) {
        req.body.image = `/media/${req.file.filename}`;
      }
      const checkUser = await User.findOne({
        where: req.body,
      });
      if (!checkUser) {
        req.body.salonId = req.user.id;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        req.body.password = hashedPassword;
        const newSpecialist = await User.create({
          ...req.body,
          role: "specialist",
          salonId: req.user.id,
        });
        const payload = {
          id: newSpecialist.id,
          username: newSpecialist.username,
          gender: newSpecialist.gender,
          role: newSpecialist.role,
          exp: Date.now() + parseInt(JWT_EXPIRATION_MS),
        };
        const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
        res.status(201).json({
          message: "Specialist has been added to your salon",
          token: token,
        });
      } else {
        const err = new Error(
          "This specialist is already added in your salon, or works at a different salon"
        );
        err.status = 401;
        res.json({ message: err.message });
      }
    } else {
      const err = new Error("Only this salon manager can add new specialist");
      err.status = 401;
      res.json({ message: err.message });
    }
  } catch (error) {
    next(error);
  }
};

////////////////////////////////////

// // Salon's categories list controller
// exports.fetchSalonCategories = async (req, res, next) => {
//   const { salonId } = req.params;
//   try {
//     if (req.user.id === +salonId && req.user.role === "salon") {
//       const foundCatergories = await Category.findAll({
//         where: {
//           salonId: salonId,
//         },
//       });
//       res.json({ thisSalonCatergories: foundCatergories });
//     } else {
//       res.status(400).json({
//         message: "Only this salon manager can view this categories list",
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// };
