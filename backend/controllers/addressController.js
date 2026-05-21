const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const getAddresses = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('addresses');
    if (!user) return next(new AppError('User not found', 404));
    res.json(user.addresses || []);
});

const addAddress = catchAsync(async (req, res, next) => {
    const { label, fullAddress, isDefault, location } = req.body;
    const user = await User.findById(req.user._id);
    
    if (isDefault) {
        user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push({ label, fullAddress, isDefault, location });
    await user.save();
    res.status(201).json(user.addresses);
});

const updateAddress = catchAsync(async (req, res, next) => {
    const { addressId } = req.params;
    const { label, fullAddress, isDefault, location } = req.body;
    
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(addressId);
    
    if (!address) {
        return next(new AppError('Address not found in your profile', 404));
    }

    if (isDefault) {
        user.addresses.forEach(addr => addr.isDefault = false);
    }

    address.label = label || address.label;
    address.fullAddress = fullAddress || address.fullAddress;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;
    
    if (location) {
        address.location = location;
    }

    await user.save();
    res.json(user.addresses);
});

const deleteAddress = catchAsync(async (req, res, next) => {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(addressId);
    
    if (!address) {
        return next(new AppError('Address not found', 404));
    }

    user.addresses.pull(addressId);
    await user.save();
    res.json(user.addresses);
});

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress };
