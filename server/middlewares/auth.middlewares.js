"use strict";
const { userIsAdmin } = require("../utils/checks");
const dbmodule = require("../database/database");

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "ERR_UNAUTHENTICATED" });
}

async function ensureIsAdmin(req, res, next) {
  const db = await dbmodule.DatabaseSingleton().get();

  if (req.isAuthenticated() && (await userIsAdmin(db, req.user.id))) {
    return next();
  }
  return res.status(403).json({ error: "ERR_NOT_ADMIN" });
}

function isTotp(req, res, next) {
  if (req.session.method === "totp") {
    return next();
  }
  return res.status(401).json({ error: "ERR_NEEDS_TOTP" });
}

module.exports = {
  ensureAuthenticated,
  isTotp,
  ensureIsAdmin,
};
