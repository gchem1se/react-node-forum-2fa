"use strict";

const { createLogger, format, transports } = require("winston");

/* custom format for winston */

const customFormat = format.printf(({ timestamp, level, message }) => {
  const levelColorizer = format.colorize();
  const coloredLevel = levelColorizer.colorize(level, level);

  return `${timestamp} :: ${coloredLevel} :: ${message}`;
});

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY/MM/DD HH:mm:ss" }),
    format.errors({ stack: true })
  ),
  transports: [
    new transports.Console({
      format: customFormat,
    }),
    // enable these to log on files
    // new transports.File({ filename: 'logs/combined.log', format: customFormat }),
    // new transports.File({ filename: 'logs/error.log', level: 'error', format: customFormat }),
  ],
  exitOnError: false,
});

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};

module.exports = { logger, errorFormatter };
