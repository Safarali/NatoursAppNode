const express = require('express');

const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.isAuthenticated);

router.get('/checkout-session/:tourID', bookingController.getCheckoutSession);

router.use(authController.isAuthorized('admin', 'super-guide'));

router
    .route('/')
    .get(bookingController.getAllBookings)
    .post(bookingController.createBooking);

router
    .route('/:id')
    .get(bookingController.getBooking)
    .patch(bookingController.updateBooking)
    .delete(bookingController.deleteBooking);

module.exports = router;
