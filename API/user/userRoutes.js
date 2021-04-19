// Imports
const express = require("express");
const router = express.Router();
const passport = require("passport");

// Importing controllers
const {
  Usersignup,
  Usersignin,
  //   fetchUser,
  //   getUserList,
  userUpdate,
} = require("./userController");

// param middleware
router.param("userId", async (req, res, next, userId) => {
  const user = await fetchUser(userId, next);
  if (user) {
    req.user = user;
    next();
  } else {
    const error = new Error("No user was found with this id");
    error.status = 404;
    next(error);
  }
});

//Sign up
//signup router
router.post("/signup", Usersignup);

// Sign in
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  Usersignin
);

// fetch Channel
// router.get("/", fetchUser);

// Get all users
// router.get("/:userId", getUserList);

// Update user
router.put("/:userId", userUpdate);

module.exports = router;
