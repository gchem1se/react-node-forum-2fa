"use strict";

const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const {logger} = require("../utils/logger");
const config = require("../constants/config");

let _db = null; // ! process-level ~ static | not exported so that db is only accessible via the singleton's .get()

exports.DatabaseSingleton = function DatabaseSingleton() {
  return {
    get: async () => {
      // open only once, then always return the same instance
      if (!_db) {
        try {
          if (config.is_development) {
            sqlite3.verbose(); // does this work?
          }
          _db = await sqlite.open({
            filename: config.sqlite_path,
            driver: sqlite3.Database,
          });
        } catch (err) {
          // catch and rethrow
          logger.error(err);
          throw new Error(
            `Unable to open the SQLite DB from path ${config.sqlite_path}`
          );
        }
      }
      return {
        // safe wrapper
        get: _db.get.bind(_db),
        exec: _db.exec.bind(_db),
        run: _db.run.bind(_db),
        all: _db.all.bind(_db),
        // no close and no raw access to database, only running queries
      };
    },
    close: async () => {
      // ! never use close actually 'cause the db will now be open only once for the entire process;
      // if a user runs code that closes the DB, it will be closed for everyone from that moment on.
      // this is only to be used in a graceful shutdown.
      if (!_db) {
        return;
      }
      await _db.close();
      _db = null;
    },
  };
};
