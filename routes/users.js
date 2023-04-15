const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../helpers/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

//Created the route for the information to be sent to the correct place. 
router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

//This code will allow users to log out. 
router.get('/logout', users.logout)

module.exports = router;