/**
 * Reusable Joi Validation Middleware
 * @param {Object} schema - Joi validation schema
 * @returns {Function} - Express middleware function
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove extra fields not in schema
      allowUnknown: true  // Allow fields not in schema (can set to false for stricter validation)
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message.replace(/"/g, ''))
        .join(', ');
      
      return res.status(400).json({
        status: 'fail',
        message: errorMessage
      });
    }

    // Replace req.body with validated and sanitized values
    req.body = value;
    next();
  };
};

module.exports = validate;
