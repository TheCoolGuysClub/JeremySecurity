const express = require('express');
const users = express.Router();
const User = require('../models/user.js');

const logger = (req, res, next) {
  console.log(req.body);
  next();
}

users.get('/register', (req, res) => {
  res.render('register');
})

users.post('/register', logger, (req, res) => {
  console.log(req.body);
})

users.get('/login', (req, res) => {
  res.render('login');
})



module.exports = users;
