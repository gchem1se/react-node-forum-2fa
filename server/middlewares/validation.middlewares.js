"use strict";

const { validationResult } = require("express-validator");
const { errorFormatter, logger } = require("../utils/logger");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  
  if (!errors.isEmpty()) {
    logger.error(errors.array()); // Use `.array()` here for proper formatting
    return res.status(422).json({ errors: errors.array() });
  }

  next();
};

module.exports = handleValidationErrors;
