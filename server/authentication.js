"use strict";

const base32 = require("thirty-two");
const dbmodule = require("./database/database");
const queries = require("./database/queries");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const {logger} = require("./utils/logger");
const TotpStrategy = require("passport-totp").Strategy;

passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    // ! do not rename "username" to "email"
    logger.info(`logging user by email ${username}`);
    try {
      const db = await dbmodule.DatabaseSingleton().get();
      const user = await db.get(queries.GET_USER_BY_EMAIL, {
        ":email": username,
      });

      if (!user) {
        logger.error("User does not exist.");
        return cb(null, false, {
          error: "Incorrect email or password.",
        });
      }

      crypto.scrypt(
        password,
        Buffer.from(user.salt, "hex"),
        32,
        (err, hashedPassword) => {
          if (err) {
            logger.error(err);
            return cb(err);
          }
          if (
            !crypto.timingSafeEqual(
              Buffer.from(user.password_hash, "hex"),
              hashedPassword
            )
          ) {
            logger.error("Incorrect email or password.");
            return cb(null, false, {
              error: "Incorrect email or password.",
            });
          }
          return cb(null, user); // everything went right
        }
      );
    } catch (err) {
      logger.error(err);
      return cb({
        message: `Failed to get user by email ${username}`,
        error: err.code,
      });
    }
  })
);

// serializeUser: save minimal info in session
passport.serializeUser((user, done) => {
  done(null, user.id); // store only the ID
});

// deserializeUser: retrieve user by ID
passport.deserializeUser(async (id, done) => {
  try {
    const db = await dbmodule.DatabaseSingleton().get();
    const user = await db.get(queries.GET_USER_BY_ID, { ":id": id }); // fetch full user from DB
    done(null, user);
  } catch (err) {
    logger.error(err);
    done(err);
  }
});

passport.use(
  new TotpStrategy(function (user, done) {
    // In case .secret does not exist, decode() will return an empty buffer
    return done(null, base32.decode(user.totp_secret), 30); // 30 = period of key validity
  })
);
