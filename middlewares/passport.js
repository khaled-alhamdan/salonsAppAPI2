const LocalStrategy = require("passport-local").Strategy;
const { Salon, User } = require("../db/models");
const bcrypt = require("bcrypt");
const JWTStrategy = require("passport-jwt").Strategy;
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;
const { JWT_SECRET } = require("../db/config/keys");

exports.localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    let user;
    user = await Salon.findOne({
      where: { username },
    });

    if (!user) {
      user = await User.findOne({
        where: { username },
      });
    }
    const passwordsMatch = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (passwordsMatch) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    done(error);
  }
});

exports.jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  async (jwtPayload, done) => {
    if (Date.now() > jwtPayload.exp) {
      return done(null, false);
    }
    try {
      let user;
      user = await Salon.findByPk(jwtPayload.id);
      if (!user) {
        user = await User.findByPk(jwtPayload.id);
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
);
