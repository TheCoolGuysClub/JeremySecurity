const express = require('express');
const users = express.Router();
const {body, validationResult} = require('express-validator/check');
const {matchedData } = require('express-validator/filter');

//local
const User = require('../models/user.js');

users.get('/register', (req, res) => {
  res.render('register');
})

users.get('/home', (req, res) => {
  res.render('home');
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
      const errorMessages = errors.array().map(obj => {
        return {message: obj.msg}
      });
      // console.log('Original errors:', errors.array());
      // console.log('Mapped errors:', errorMessages);

      req.flash('errorMessages', errorMessages)
      return res.redirect('/register');
    }
    const userData = matchedData(req);
    const user = new User(userData);
    user.save()
      .then(user => {
        res.redirect('home');
      }).catch(e => {
        res.redirect('/register');
      })

})

users.get('/login', (req, res) => {
  res.render('login');
})



module.exports = users;
