const express = require('express');
const users = express.Router();
const {body, validationResult} = require('express-validator/check');
const {matchedData } = require('express-validator/filter');

//local
const User = require('../models/user.js');

users.get('/register', (req, res) => {
  res.render('register');
})

users.post('/register', [
  body('email')
    .isEmail()
    .withMessage("invalid email adress"),
  body('password')
    .isLength({min: 6})
    .withMessage('Password must be at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contains at least one digit')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('errors:', errors.array());
    }
    const user = matchedData(req);
    console.log('valid user:', user);
})

users.get('/login', (req, res) => {
  res.render('login');
})



module.exports = users;
