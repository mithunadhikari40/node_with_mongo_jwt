const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const config = require('../config/database');
const Team = require('../models/teams');
const PersonalSales = require('../models/personal_sale');
const multer = require('multer');
const path = require('path');
const upload=require('./ext');
const uuidv1 = require('uuid/v1');


module.exports = function (app, passport) {
    app.get('/', function (req, res, next) {
        res.json('Welcome to this thing');
    });

    app.post('/register', function (req, res, next) {

        const m = new User();
        m.user_id = mongoose.mongo.ObjectId();
        m.name = "Suman Maharjan";
        m.commission_per_sale = 2;
        m.total_sales_target = 43;
        m.monthly_expense = 32.23;
        m.facebook_id = "sdjfs34545";
        m.google_id = "dsfsdfw435435";
        m.flag = false;
        m.profile_image = "efdhskj45345";
        m.password = "password";
        m.email = "email@thisemail.com";
        const lastLogin = [];
        const some = {latitude: 432.43, longitude: 423.43, updated: Date.now(), device_id: "e98546"};
        lastLogin.push(some);
        const authData = {auth_key: "94357485", expires_at: Date.now()};
        const images = {image_location: "rieute", uploaded_at: Date.now()};
        const images2 = {image_location: "rieute", uploaded_at: Date.now()};
        const images3 = {image_location: "rieute", uploaded_at: Date.now()};
        const imm = [];
        imm.push(images);
        imm.push(images2);
        imm.push(images3);
        m.last_login = lastLogin;
        m.images = imm;
        m.auth = authData;

        User.createUser(m, function (err, user) {
            if (err)
                return res.json({success: false, message: err, code: 400, response: null});
            return res.json({success: true, message: 'user is created', code: 200, response: user});
        });
        // res.json('Welcome to this thing');
    });

    app.post('/login', function (req, res, next) {
        const email = req.body.email;
        const pass = req.body.password;


        User.getUserByEmail(email, function (err, user) {
            if (err) throw err;
            if (!user) {
                return res.json({success: false, message: 'user not found', code: 400, response: null});
            } else {

                User.comparePassword(pass, user.password, function (err, isMatch) {
                    if (err) throw err;
                    if (isMatch) {

                        const userData = {email: user.email, password: user.password, _id: user._id};
                        const jwtToken = jwt.sign({user: userData}, config.secret, {expiresIn: config.tokenExpire});
                        // const refreshToken = jwt.sign({user: userData}, config.refreshSecret, {expiresIn: config.tokenExpire});

                        return res.json({
                            success: true, token: 'bearer ' + jwtToken, code: 200,
                            userMap: userData
                            /*user: {
                                email: user.email,
                                id: user._id,
                                name: user.name,

                            }*/
                        });

                    } else {
                        return res.json({success: false, message: 'password is incorrect', code: 400, response: null});

                    }
                })
            }


        });
        // res.json('Welcome to this thing');
    });

    app.get('/profile', passport.authenticate('jwt', {session: false}), function (req, res, next) {
        // res.json('Welcome to this thing');

        res.json({user: req.user});
    });


    app.post('/createTeam', /*passport.authenticate('jwt', {session: false}),*/ function (req, res, next) {


        passport.authenticate('jwt', function (err, user, info) {
            if (err) {
                return next(err)
            }
            if (!user) {
                return res.json({success: false, message: 'token is expired', code: 400, response: null});
            }


            return Team.saveLead(req, res, next);

            /*// res.json('Welcome to this thing');
            const name = req.body.teamName;
            const createdBy = req.body.createdBy;
            const member = req.body.members;
            const announcementMessage = req.body.announcementMessage;
            const announcementDate = req.body.announcementDate;
            const uploadDate = req.body.date;

            if (!(name || createdBy || member || announcementMessage)) {
                return res.json({
                    success: false,
                    message: "Required parameters are not supplied",
                    code: 400,
                    response: null
                });

            }


            const team = new Team();
            team.name = name;
            team.createdBy = createdBy;
            team.members.push(member);
            team.announce_message = {message: announcementMessage, announced_at: announcementDate};
            team.date = uploadDate;

            team.save(function (err, team) {
                if (err)
                    return res.json({success: false, message: err, code: 400, response: null});
                return res.json({success: true, message: team, code: 400, response: null});

            });
*/

        })(req, res, next);


        // res.json({user: req.user});
    });


    app.post('/addPersonalSale', function (req, res, next) {
        passport.authenticate('jwt', function (err, user, info) {
            if (err) {
                return next(err)
            }
            if (!user) {
                return res.json({success: false, message: 'token is expired', code: 400, response: null});
            }
            return PersonalSales.saveSales(req, res, next);

        })(req, res, next);
    });


    app.post('/addPhotos', function (req, res, next) {


        /*    passport.authenticate('jwt', function (err, user, info) {
                if (err) {
                    return next(err)
                }
                if (!user) {
                    return res.json({success: false, message: 'token is expired', code: 400, response: null});
                }
    */


        upload(req, res, function (err) {
            const imagePaths = [];
            // imagePaths.concat(req.files.path);
            req.files.forEach(f => {
                imagePaths.push(f.path);
            });
            if (err) return res.json({success: false, message: err, code: 400, response: imagePaths});

            return res.json({success: true, message: 'image upload success', code: 200, response: imagePaths});

            // return User.addPhotos(req, res, next, imagePaths);

        });

        /*

                })(req, res, next);
        */


    });


    app.post('/protected', function (req, res, next) {
        passport.authenticate('jwt', function (err, user, info) {
            if (err) {
                return next(err)
            }
            if (!user) {
                return res.json({success: false, message: 'token is expired', code: 400, response: null});

                // return res.redirect('/signin')
            }
            // res.redirect('/account');
            return res.json({success: false, message: null, code: 400, response: user});

        })(req, res, next);
    });/*
    const storage1 = multer.diskStorage({
        // destination: '../uploads/content/images/',
        destination: path.join(__dirname, '../public/content/images/'),
        filename: function (req, file, callback) {
            callback(null, uuidv1() + "-" + path.extname(file.originalname));
        }/!*, filter: checkFileTypeImage(file, function (err, something) {

            })*!/
    });
    const upload = multer({storage: storage1}).array('userPhoto', 2);


    */

    app.get('/logout', function (req, res, next) {
        // res.json('Welcome to this thing');
        req.logout();
        res.redirect('/');
        req.json({user: req.user});
    });


};
