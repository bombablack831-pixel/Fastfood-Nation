const Joi = require('joi');

const placeOrderSchema = Joi.object({
  restaurant: Joi.string().required().messages({
    'string.empty': 'Restaurant ID is required'
  }),
  items: Joi.array().items(
    Joi.object({
      food: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
      price: Joi.number().required()
    })
  ).min(1).required().messages({
    'array.min': 'At least one item is required to place an order'
  }),
  subtotal: Joi.number().required(),
  taxPrice: Joi.number().required(),
  deliveryPrice: Joi.number().required(),
  totalAmount: Joi.number().required(),
  deliveryAddress: Joi.string().required().messages({
    'string.empty': 'Delivery address is required'
  }),
  deliveryLocation: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required()
  }).required(),
  paymentMethod: Joi.string().valid('cod', 'online', 'wallet', 'card', 'upi').default('cod')
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid(
    'pending', 'placed', 'confirmed', 'preparing', 'picked_up', 'out_for_delivery', 'delivered', 'cancelled'
  ),
  deliveryBoy: Joi.string().allow('', null)
});

module.exports = {
  placeOrderSchema,
  updateStatusSchema
};
