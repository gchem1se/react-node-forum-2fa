"use strict";

const express = require("express");
const morgan = require("morgan");
const config = require("./constants/config.js");
const { logger } = require("./utils/logger.js");
const app = express();
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

/* init express-session */
app.use(
  session({
    secret: config.server_sessions_secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "lax", // sent when clicking link from another site to mine, but not in cross-site POSTs.
      secure: false, // i'm in http
    },
  })
); // default values for the session cookie: { path: '/', httpOnly: true, secure: false, maxAge: null }, unspecified SameSite.

/* init passport.js */
require("./authentication.js"); // register callbacks
app.use(passport.authenticate("session")); // init passport to use sessions

/* cors */
app.use(
  cors({
    origin: config.development_frontend_server_URI,
    credentials: true,
  })
);

/* other globally-used middlewares */
app.use(express.json()); // handling JSON requests
app.use(express.urlencoded({ extended: true })); // handling Form-encoded requests
app.use("/static", express.static("./public"));
app.use(
  morgan("dev", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
); // for logging requests with winston as a logger

/* register routes */
const apiRoutes = require("./routes/api.routes.js");
app.use("/api", apiRoutes);
const authRoutes = require("./routes/auth.routes.js");
app.use("/auth", authRoutes);

/* prevent full stack trace in prod */
// ! put this after registering all routes
if (!config.is_development) {
  app.use((err, req, res, next) => {
    // log the full error stack internally, don't show it to user
    logger.error(err.stack);

    res.status(err.status || 500).json({
      message: "Internal Server Error",
    });
  });
}

module.exports = app;
