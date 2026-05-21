const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

// Prevent user from submitting more than one review per restaurant
reviewSchema.index({ restaurant: 1, user: 1 }, { unique: true });

// Static method to calculate average rating
reviewSchema.statics.calcAverageRatings = async function(restaurantId) {
    const stats = await this.aggregate([
        {
            $match: { restaurant: restaurantId }
        },
        {
            $group: {
                _id: '$restaurant',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    const Restaurant = require('./Restaurant');
    if (stats.length > 0) {
        await Restaurant.findByIdAndUpdate(restaurantId, {
            numReviews: stats[0].nRating,
            rating: stats[0].avgRating.toFixed(1)
        });
    } else {
        await Restaurant.findByIdAndUpdate(restaurantId, {
            numReviews: 0,
            rating: 0
        });
    }
};

// Call calcAverageRatings after save
reviewSchema.post('save', function() {
    this.constructor.calcAverageRatings(this.restaurant);
});

// Call calcAverageRatings before delete (using middleware for findOneAndDelete/Update if needed, but post-save is enough for basic create)
// Note: For findByIdAndDelete we use post middleware
reviewSchema.post(/^findOneAnd/, async function(doc) {
    if (doc) await doc.constructor.calcAverageRatings(doc.restaurant);
});

module.exports = mongoose.model('Review', reviewSchema);
