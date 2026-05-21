const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');

const addReview = async (req, res) => {
    const { rating, comment, restaurantId } = req.body;

    try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Check if user already reviewed
        const alreadyReviewed = await Review.findOne({ user: req.user._id, restaurant: restaurantId });
        if (alreadyReviewed) {
            return res.status(400).json({ message: 'You have already reviewed this restaurant' });
        }

        const review = await Review.create({
            user: req.user._id,
            restaurant: restaurantId,
            rating: Number(rating),
            comment
        });

        // Update Restaurant Average Rating
        const reviews = await Review.find({ restaurant: restaurantId });
        const numReviews = reviews.length;
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

        restaurant.numReviews = numReviews;
        restaurant.rating = avgRating.toFixed(1);
        await restaurant.save();

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRestaurantReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ restaurant: req.params.restaurantId })
            .populate('user', 'name role')
            .sort('-createdAt');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addReview, getRestaurantReviews };
