"use strict";

const app = require("./app");
const { logger } = require("./utils/logger");
const dbmodule = require("./database/database");
const config = require("./constants/config");

/* run application */
const PORT = config.port || 3000;
const server = app.listen(PORT, () => {
  logger.info(`${config.app_name} backend running on port ${PORT}`);
});

/* register a graceful shutdown that closes the DB */
async function shutdown() {
  logger.info("Shutting down gracefully...");
  server.close(); // stop accepting new requests
  await dbmodule.DatabaseSingleton().close();
  logger.info("DB closed, exiting");
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
