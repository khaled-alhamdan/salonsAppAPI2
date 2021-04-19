const express = require("express");
const path = require("path");
const cors = require("cors");
const ip = require("ip");
const db = require("./db/models");
const passport = require("passport");
const {
  localStrategy,
  jwtStrategy,
  localStrategy2,
  jwtStrategy2,
} = require("./middlewares/passport");

// Importing Routers
const salonRoutes = require("./API/salon/salonRoutes");
const userRoutes = require("./API/user/userRoutes");

// init app
const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);
passport.use(localStrategy2);
passport.use(jwtStrategy2);
app.use("/media", express.static(path.join(__dirname, "./media")));

// Routers app use
app.use("/salons", salonRoutes);
app.use("/users", userRoutes);

// Errors handler middlewre
app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Servier Error" });
});

// start server
const runApp = async () => {
  try {
    // await db.sequelize.sync({ alter: true });
    await db.sequelize.sync();

    app.listen(process.env.PORT, () => {
      console.log("Connection to the database was successful!");
      console.log(`Running on ${ip.address()}:${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Failed to start server:", error);
  }
};

runApp();

module.exports = app;
