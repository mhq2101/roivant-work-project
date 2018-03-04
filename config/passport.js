var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../models/').User;

// expose this function to our app using module.exports
module.exports = function (passport) {

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {

    try {
      done(null, user.id);
    } catch (err) {
      done(err);
    }

  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    User.findById(id)
      .then(user => {
        done(null, user)
      })
      .catch(err => {
        done(err)
      })
  });


  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
    function (req, email, password, done) {

      // asynchronous
      // User.findOne wont fire unless data is sent back
      process.nextTick(function () {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({
          where: {
            email
          }
        })
          .then(user => {
            if (user) {
              return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            }
            else {
              User.create({
                email,
                password: User.generateHash(password)
              })
                .then(user => {
                  return done(null, user)
                })
            }
          })
          .catch(err => {
            done(err)
          })
      });
    }));

  // =========================================================================
  // LOCAL LOGIN ============================================================
  // =========================================================================


  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
    function (req, email, password, done) { // callback with email and password from our form

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists

      User.findOne({
        where: {
          email
        }
      })
        .then(user => {
          if (!user) {
            return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
          }

          if (!user.validPassword(password)) {
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
          }

          return done(null, user);
        })

      User.findOne({ 'local.email': email }, function (err, user) {
        // if there are any errors, return the error before anything else
        if (err)
          return done(err);

        // if no user is found, return the message
        if (!user)
          return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

        // if the user is found but the password is wrong
        if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

        // all is well, return successful user
        return done(null, user);
      });

    }));
};
