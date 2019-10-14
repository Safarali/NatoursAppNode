/* eslint-disable */

import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { displayAlert } from './alerts';
import { updateDataSettings } from './updateSettings';
import { bookTour } from './stripe';

document.addEventListener('DOMContentLoaded', () => {
    // Logins user
    const loginForm = document.querySelector('.form--login');

    if (loginForm) {
        loginForm.addEventListener('submit', e => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            login(email, password);
        });
    }

    // Display map
    const mapBox = document.getElementById('map');

    if (mapBox) {
        const locations = JSON.parse(mapBox.dataset.locations);
        displayMap(locations);
    }

    // Logout
    const logoutLink = document.querySelector('.nav__el--logout');

    if (logoutLink) {
        logoutLink.addEventListener('click', logout);
    }

    // Update data
    const userDataForm = document.querySelector('.form-user-data');

    if (userDataForm) {
        userDataForm.addEventListener('submit', e => {
            e.preventDefault();
            const form = new FormData();

            form.append('name', document.getElementById('name').value);
            form.append('email', document.getElementById('email').value);
            form.append('photo', document.getElementById('photo').files[0]);
            updateDataSettings(form, 'data');
        });
    }

    // Update password

    const userPasswordForm = document.querySelector('.form-user-password');

    if (userPasswordForm) {
        userPasswordForm.addEventListener('submit', async e => {
            e.preventDefault();
            document.querySelector('.btn--save-password').textContent =
                'Updating...';

            const passwordCurrent = document.getElementById('password-current')
                .value;
            const password = document.getElementById('password').value;
            const passwordConfirm = document.getElementById('password-confirm')
                .value;

            await updateDataSettings(
                { password, passwordConfirm, passwordCurrent },
                'password'
            );
            document.querySelector('.btn--save-password').textContent =
                'Update Password';

            document.getElementById('password-current').value = '';
            document.getElementById('password').value = '';
            document.getElementById('password-confirm').value = '';
        });
    }

    // Book Tour

    const bookBtn = document.getElementById('book-tour');

    if (bookBtn) {
        bookBtn.addEventListener('click', e => {
            e.target.textContent = 'Processing...';
            const { tourId } = e.target.dataset;
            bookTour(tourId);
        });
    }
});
