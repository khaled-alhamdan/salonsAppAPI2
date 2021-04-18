const { Salon } = require("../../db/models");
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
    // if (req.user.role === "admin") {
    if (req.file) {
      req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    req.body.password = hashedPassword;
    const newSalon = await Salon.create({ ...req.body, role: "salon" });
    const payload = {
      id: newSalon.id,
      name: newSalon.username,
      exp: Date.now() + JWT_EXPIRATION_MS,
    };
    const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
    res.status(201).json({ token: token });
    // }
    // res.status(400).json({ message: "Only admins can add new salons" });
  } catch (error) {
    next(error);
  }
};

// Salons sign in controller
exports.signin = (req, res) => {
  const { user } = req;
  const payload = {
    id: user.id,
    username: user.username,
    exp: Date.now() + parseInt(JWT_EXPIRATION_MS),
  };
  const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
  res.json({ token: token });
};

// Get token info controller
exports.getTokenInfo = (req, res, next) => {
  res.json(req.user);
};

// Salons list controller
exports.getSalonsList = async (_, res) => {
  try {
    // if (req.user.role === "admin") {
    const salons = await Salon.findAll();
    res.json(salons);
    // }
    // res.status(400).json("Only admins can view salons list");
  } catch (error) {
    res.status(500).json("No salons found");
  }
};

// Get salon by its id
exports.getSalonById = async (req, res, next) => {
  const { salonId } = req.params;
  try {
    if (req.user.id === +salonId && req.user.role === "salon") {
      const foundSalon = await Salon.findByPk(salonId);
      res.status(200).json({ foundSalon });
    } else {
      res.status(400).json("Only this salon manager can view this salon info");
    }
  } catch (error) {
    next(error);
  }
};

// Updating salon info controller
exports.updateSalon = async (req, res, next) => {
  //   const { salonId } = req.params;
  try {
    // if (req.user.id === salonId) {
    if (req.file) {
      req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
    }
    await req.salon.update(req.body);
    res.status(200).json({ message: "Salon info has been updated" });
    // }
    // res
    //   .status(400)
    //   .json({ message: "Only this salon manager can update the info" });
  } catch (error) {
    next(error);
  }
};

// Deleting a salon
exports.deleteSalon = async (req, res, next) => {
  try {
    //   if (req.user.role !== "viewer") {
    await req.salon.destroy(req.body);
    res.status(200).json("Salon has been deleted");
    //   }
    //   res.status(400).json({ message: "Viewers can not delete movies" });
  } catch (error) {
    next(error);
  }
};
