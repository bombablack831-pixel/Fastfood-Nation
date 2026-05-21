const User = require('../models/User');

const toggleFavorite = async (req, res) => {
    const { foodId } = req.body;
    try {
        const user = await User.findById(req.user._id);
        
        const isFavorite = user.favorites.includes(foodId);
        if (isFavorite) {
            user.favorites = user.favorites.filter(id => id.toString() !== foodId);
        } else {
            user.favorites.push(foodId);
        }
        
        await user.save();
        res.json({ favorites: user.favorites, isFavorite: !isFavorite });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'favorites',
            populate: { path: 'restaurant', select: 'name' }
        });
        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { toggleFavorite, getFavorites };
