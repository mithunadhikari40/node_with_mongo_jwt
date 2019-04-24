const mongoose = require('mongoose');
const config = require('../config/database');
const bcrypt = require('bcryptjs');


const team = require('./teams');
const schema = mongoose.Schema;

const user_schema = mongoose.Schema({
    user_id: schema.Types.ObjectId,
    name: {type: String, required: true, trim: true},
    commission_per_sale: {type: Number, required: true},
    monthly_expense: {type: Number, required: true},
    facebook_id: {type: String, trim: true},
    google_id: {type: String, trim: true},
    flag: {type: Boolean, default: true},
    total_sales_target: {type: Number, required: true},
    profile_image: {type: String, trim: true},
    password: {type: String, trim: true, required: true},
    email: {type: String, trim: true, required: true, unique: true},
    last_login: [
        {

            latitude: {type: Number, required: false},
            longitude: {type: Number, required: false},

            updated: {type: Date, default: Date.now},
            device_id: {type: String, trim: true},
        }
    ],
    auth: {
        auth_key: {type: String, required: true},
        expires_at: {type: Date}
    },
    images: [{
        image_location: {type: String, trim: true},
        uploaded_at: {type: Date, default: Date.now}
    }],
    teams: [{type: schema.Types.ObjectId, ref: 'teams'}],

    // stories: [{type: schema.Types.ObjectId, ref: 'Story'}],
    // another: {type: schema.Types.ObjectId, ref: 'Story'},


});


const user = module.exports = mongoose.model('users', user_schema);

module.exports.getUserById = function (id, callback) {
    user.findById(id, callback);
};


module.exports.getUserByEmail = function (email, callback) {
    user.findOne({email: email}, callback);
};


module.exports.addPhotos = function (req, res, next, imagePath) {

    const userId = req.userId;

    if (!(userId)) {
        return res.json({
            success: false,
            message: "Required parameters are not supplied",
            code: 400,
        });
    }
    user.findById(userId, function (err, usr) {
        if (err) throw err;
        if (!usr) {
            return res.json({
                success: false,
                message: "The user does not exists or might have been removed",
                code: 400,
            });
        }

        usr.images.push(imagePath);

        usr.save(function (err, newUser) {
            if (err)
                throw  err;

            return res.json({
                success: true,
                message: newUser,
                code: 200,
            });
        })


    });
    // user.findOne({email: email}, callback);
};

module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        })
    })
};

module.exports.getAllTeamFromUserId = function (userId, callback) {
    let userMap = {};
    user.findById(userId, function (err, usr) {
        if (err) throw  err;
        usr.teams.forEach(function (teamId) {
            team.getTeamById(teamId, function (error, teamDetails) {
                if (err) throw  error;
                userMap[teamId] = teamDetails;
            })
        });
    }, callback);

};


module.exports.comparePassword = function (password, hash, callback) {
    bcrypt.compare(password, hash, function (err, isMatch) {
        if (err)
            throw err;
        callback(null, isMatch);
    })
};

const checkFileTypeImage = function (file, callback) {
    const fileTypes = /jpg/;
    //check extension
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    console.log('the ext name is ' + extname);
    //check mime type
    const mimetype = fileTypes.test(file.mimeType);
    console.log('the mimetype is ' + mimetype);

    if (extname) {
        return callback(null, true);
    } else {
        callback('only images are allowed');
    }
};