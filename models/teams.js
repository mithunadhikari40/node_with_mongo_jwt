const mongoose = require('mongoose');
const config = require('../config/database');
const bcrypt = require('bcryptjs');


const schema = mongoose.Schema;

const users = require('./user');
const team_schema = mongoose.Schema({
    name: {type: String, required: true, trim: true},
    date: {type: Date, default: Date.now},
    createdAt: {type: Date, default: Date.now},
    createdBy: {type: schema.Types.ObjectId, ref: 'users'},
    flag: {type: Boolean, default: true},
    members: [{type: schema.Types.ObjectId, ref: 'users'}],

    announce_message: [{
        message: {type: String, trim: true},
        announced_at: {type: Date, default: Date.now}
    }],

    // another: {type: schema.Types.ObjectId, ref: 'Story'},


});


const Teams = module.exports = mongoose.model('teams', team_schema);

module.exports.getTeamById = function (id, callback) {
    Teams.findById(id, callback);
};


module.exports.getAllMemberDetailsFromTeam = function (id, callback) {
    let usr = {};

    Teams.getTeamById({_id: _id}, function (err, teams) {
        teams.members.forEach(function (team) {
            usr[id] = users.findById(team._id);
        });
    }, callback);

    // callback(users);
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


module.exports.comparePassword = function (password, hash, callback) {
    bcrypt.compare(password, hash, function (err, isMatch) {
        if (err)
            throw err;
        callback(null, isMatch);
    })
};

module.exports.saveLead = function (req, res, next) {
    // res.json('Welcome to this thing');
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


    const team = new Teams();
    team.name = name;
    team.createdBy = createdBy;
    team.members.push(member);
    team.announce_message = {message: announcementMessage, announced_at: announcementDate};
    team.date = uploadDate;

    team.save(function (err, team) {
        if (err)
            return res.json({success: false, message: err, code: 400});
        return res.json({success: true, message: team, code: 200});

    });

};