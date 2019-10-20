const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');

exports.getOverview = catchAsync(async (req, res, next) => {
    // 1) Get tour data from collection
    const tours = await Tour.find();

    // 2) Render template using tour date from 1)
    res.status(200).render('overview', {
        title: 'All tours',
        tours
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });

    if (!tour) {
        return next(new AppError('There is not tour with that name', 404));
    }

    res.status(200).render('tour', {
        title: tour.name,
        tour: tour
    });
});

exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: 'Login'
    });
};

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your Account'
    });
};

// Update user data without api

exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email
        },
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).render('account', {
        title: 'Your Account',
        user: updatedUser
    });
});

// Get My Tours

exports.getMyTours = catchAsync(async (req, res, next) => {
    // 1) Find all bookings\
    const bookings = await Booking.find({ user: req.user.id });

    // 2) Find tours with returned IDS
    const tourIDs = bookings.map(booking => booking.tour);
    const tours = await Tour.find({ _id: { $in: tourIDs } });

    res.status(200).render('overview', {
        title: 'My tours',
        tours
    });
});
