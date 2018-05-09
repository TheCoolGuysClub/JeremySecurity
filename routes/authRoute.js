const express = require('express');
const authRoute = express.Router();
const {body, validationResult} = require('express-validator/check');
const {matchedData } = require('express-validator/filter');

//local
const User = require('../models/user.js');

authRoute.get('/register', (req, res) => {
  res.render('register');
})

authRoute.get('/home', (req, res) => {
  res.render('home');
})

authRoute.post('/register', [
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
        req.flash('sucessMessage', {message: "sign up succuessful"});
        res.redirect('/login');
      }).catch(e => {
        if(e.code === 11000) {
          req.flash('errorMessages',{message: "Duplicate Email!!!"} );
        }
        res.redirect('/register');
      })

})

authRoute.get('/login', (req, res) => {
  res.render('login');
})

authRoute.post('/login', (req, res) => {
  console.log('POST LOGIN ROUTE HIGH!!!!');
  res.redirect('home');
})



module.exports = authRoute;
