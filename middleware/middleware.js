const validateUser = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    req.flash('errorMessages', {message: "You are not allowed to access this route. Please login and try again"});
    res.redirect('/login');
  }
}

module.exports = {validateUser};
