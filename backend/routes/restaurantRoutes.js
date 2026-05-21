const express = require('express');
const router = express.Router();
const { 
  createRestaurant, 
  getRestaurants, 
  getOwnerRestaurant,
  addFoodItem, 
  updateFoodItem,
  deleteFoodItem,
  getRestaurantMenu,
  getTrendingItems,
  getRestaurantById,
  getReviews,
  addReview,
  toggleOpenStatus,
  updateRestaurant,
  getRiders,
  getRestaurantAnalytics,
  searchAndFilterFoods,
  getNearbyRestaurants,
  getTopRatedRestaurants
} = require('../controllers/restaurantController');
const { protect, authorize } = require('../middleware/auth');

router.get('/riders', protect, getRiders);
router.get('/analytics', protect, authorize('owner'), getRestaurantAnalytics);
router.get('/', getRestaurants);
router.get('/trending', getTrendingItems);
router.get('/top-rated', getTopRatedRestaurants);
router.get('/foods/search', searchAndFilterFoods);
router.get('/nearby', getNearbyRestaurants);

// Specific non-param routes MUST be before /:id
router.get('/owner/me', protect, authorize('owner'), getOwnerRestaurant);
router.patch('/owner/update', protect, authorize('owner'), updateRestaurant);
router.put('/owner/toggle-status', protect, authorize('owner'), toggleOpenStatus);

// Param routes
router.get('/:id', getRestaurantById);
router.get('/:restaurantId/menu', getRestaurantMenu);
router.get('/:id/reviews', getReviews);

// Protected routes (User)
router.post('/:id/reviews', protect, addReview);

// Protected routes for Owners
router.post('/', protect, authorize('owner'), createRestaurant);
router.post('/:restaurantId/food', protect, authorize('owner'), addFoodItem);
router.put('/food/:id', protect, authorize('owner'), updateFoodItem);
router.delete('/food/:id', protect, authorize('owner'), deleteFoodItem);

module.exports = router;
