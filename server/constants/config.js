"use strict";
const path = require("path");

module.exports = {
  port: 3000,
  server_sessions_secret:
    "e3c13723d6453e872ce4f62dbe7c61bb09417185a693f4c81011ba580df9623c41b78159711228a7bd5a1b5a066d69242106fb3fa999b08c051260d791c8d8f3", // 64 bytes
  development_frontend_server_URI: "http://localhost:5173",
  is_development: true,
  sqlite_path: path.join(__dirname, "../database/database.db"),
  app_name: "forum-react-wa-2025",
};
