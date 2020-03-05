const User = require('../DBSchemas/user');

let auth = (req, res, next) => {

  let token = req.cookies.w_auth;
  let token1 = req.cookies.w_authExp;

  User.findByToken(token1, (err, user) => {
    if (err) throw err;
    if (!user)
      return res.json({
        isAuth: false,
        error: true
      });

    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };