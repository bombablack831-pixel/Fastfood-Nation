const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().required().min(2).max(50).messages({
    'string.empty': 'Name is required',
    'string.min': 'Name should be at least 2 characters long'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.empty': 'Password is required'
  }),
  role: Joi.string().valid('customer', 'owner', 'delivery', 'admin').default('customer'),
  phone: Joi.string().pattern(/^[0-9]{10}$/).messages({
    'string.pattern.base': 'Phone number must be exactly 10 digits'
  }),
  referralCode: Joi.string().allow('', null),
  
  // Role specific fields
  restaurantName: Joi.string().min(2).max(100),
  restaurantAddress: Joi.string().min(5).max(255),
  vehicleType: Joi.string().valid('bike', 'scooter', 'cycle', 'car'),
  licenseNumber: Joi.string().min(5).max(50)
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Valid email is required',
    'string.empty': 'Email cannot be empty'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required'
  })
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required()
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
};
