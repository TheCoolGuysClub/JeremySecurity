//downloaded from internet
const express = require('express');
const authRoute = express.Router();
const {body, validationResult} = require('express-validator/check');
const {matchedData } = require('express-validator/filter');
const bcrypt = require('bcryptjs');

//local exports
const User = require('../models/user.js');
const {validateUser} = require('../middleware/middleware.js')

authRoute.get('/register', (req, res) => {
  res.render('register');
})

authRoute.get('/home', validateUser, (req, res) => {
  console.log('userId:', req.session.userId);
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
  User.findOne({email: req.body.email})
    .then(user => {
      if(!user) {
        req.flash('errorMessages', {message: 'This email does not exist.'});
        res.redirect('/login');
      } else {
        bcrypt.compare(req.body.password, user.password)
          .then(passwordIsValid => {
            if (passwordIsValid) {
              req.session.userId = user._id;
              console.log('userID in session:', user._id);
              req.flash('sucessMessage', {message: "login succuessful"});
              res.redirect('/home');
            } else {
              req.flash('errorMessages', {message: 'Invalid password'});
              res.redirect('/login');
            }

          })
          .catch(e => {
            console.log(e);
          })
      }
    })
    .catch(e => {
      req.flash('errorMessages', {message: 'This email does not exist.'});
      res.redirect('/login');
    })
})

authRoute.post('/logout', (req, res) => {
  req.session.userId = undefined;
  res.redirect('/login');
})


module.exports = authRoute;
