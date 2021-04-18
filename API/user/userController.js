const { User } = require("../../db/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRATION_MS } = require("../../db/config/keys");

//fetch
// exports.fetchUser = async (userId, next) => {
//   try {
//     const user = await User.findByPk(userId);
//     return user;
//   } catch (error) {
//     next(error);
//   }
// };

//SignUp user
exports.Usersignup = async (req, res, next) => {
  const saltRounds = 10;
  const { password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    req.body.password = hashedPassword;
    const newUser = await User.create(req.body);
    const payload = {
      id: newUser.id,
      username: newUser.username,
      exp: Date.now() + JWT_EXPIRATION_MS,
    };
    const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);

    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

// user sign in
exports.Usersignin = (req, res) => {
  try {
    const { user } = req;
    const payload = {
      id: user.id,
      username: user.username,
      exp: Date.now() + parseInt(JWT_EXPIRATION_MS), // the token will expire 15min from when it's generated
    };
    const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
    res.json({ token: token });
  } catch (error) {
    next(error);
  }
};

//Get user/specialist List
// exports.getUserList = async (req, res, next) => {
//   try {
//     const user = await User.findAll({
//       attributes: { exclude: ["password","createdAt", "updatedAt"] },
//     });
//     res.status(200).json(user);
//   } catch (error) {
//     next(error);
//   }
// };

//update user/specialist
exports.userUpdate = async (req, res) => {
  const { userId } = req.params;
  try {
    const foundUser = await User.findByPk(userId);
    if (foundUser) {
      await foundUser.update(req.body);
      res.status(204).end();
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
