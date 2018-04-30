const express = require('express');
const users = express.Router();

users.get('/register', (req, res) => {
  res.render('register');
})

users.get('/login', (req, res) => {
  res.render('login');
})

module.exports = users;
