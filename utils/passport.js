const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');

function initialize(passport) {
  const authenticateUser = async (username, password, done) => {
    const user = await userModel.findByUsername(username);
    if (user == null) {
      return done(null, false, { message: 'No user with that username' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user))
  passport.deserializeUser((id, done) => {
    return done(null, id)
  })
}

module.exports = initialize