module.exports = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  } else {
    
    req.session.returnTo = req.originalUrl;
    
    res.redirect('/login');
  }
};
  