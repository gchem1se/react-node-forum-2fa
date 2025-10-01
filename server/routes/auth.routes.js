"use strict";

const express = require("express");
const router = express.Router();
const {
  ensureAuthenticated,
  ensureIsAdmin,
} = require("../middlewares/auth.middlewares");
const passport = require("passport");
const dbmodule = require("../database/database");
const queries = require("../database/queries");
const { logger } = require("../utils/logger");
const handleValidationErrors = require("../middlewares/validation.middlewares");
const { check } = require("express-validator");

router.get("/user", ensureAuthenticated, async (req, res) => {
  try {
    const db = await dbmodule.DatabaseSingleton().get();

    const user = await db.get(queries.GET_USER_BY_ID, {
      ":id": req.user.id,
    });

    res.json({
      username: user.username,
      email: user.email,
      is_admin: user.is_admin,
      okTOTP: req.session.method === "totp",
    });
  } catch (error) {
    logger.error(error);
    res.status(503).end();
  }
});

router.post(
  "/login",
  [
    check("username").isEmail().withMessage("Invalid email address"),
    check("password")
      .trim()
      .notEmpty()
      .withMessage("Password must not be empty"),
    handleValidationErrors,
    passport.authenticate("local"),
  ],
  (req, res) => {
    res.json({ ok: true });
  }
);

router.post(
  "/totp",
  [
    ensureAuthenticated,
    ensureIsAdmin,
    check("code").trim().notEmpty().withMessage("Code must not be empty"),
    handleValidationErrors,
    passport.authenticate("totp"),
  ],
  (req, res) => {
    req.session.method = "totp";
    res.json({ ok: true });
  }
);

router.post("/logout", ensureAuthenticated, (req, res) => {
  req.logout(() => {
    res.json({ ok: true });
  });
});

module.exports = router;
