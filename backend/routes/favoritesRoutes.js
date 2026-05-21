const express = require('express');
const router = express.Router();
const { toggleFavorite, getFavorites } = require('../controllers/favoritesController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getFavorites).post(protect, toggleFavorite);

module.exports = router;
