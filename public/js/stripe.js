/* eslint-disable */
import axios from 'axios';
const stripe = Stripe('pk_test_aqMDthzvOpKbN3Xxo9sEBdCk00U3GsNwRs');

import { displayAlert } from './alerts';

export const bookTour = async tourId => {
    try {
        // 1) Get checkout session from API
        const session = await axios(
            `/api/v1/bookings/checkout-session/${tourId}`
        );

        // 2) Create checkout form + charge credit card

        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        displayAlert('error', err);
    }
};
