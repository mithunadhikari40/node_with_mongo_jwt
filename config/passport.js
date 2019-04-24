const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('./database');
// const  passport=require('passport');

module.exports = function (passport) {
    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = config.secret;
// opts.secretOrKey = 'secret';
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';


    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        console.log('payload',jwt_payload);
        User.getUserById(jwt_payload.user._id, function (err, user) {
        // User.getUserById(jwt_payload._doc._id, function (err, user) {
            // User.findOne({id: jwt_payload.sub}, function(err, user) {
            //
            // const message={status:401,message:"The token is expired"};
            // console.log(`token message is ${err}`);

            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
                // or you could create a new account
            }
        });
    }));
};

