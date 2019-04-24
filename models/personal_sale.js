const mongoose = require('mongoose');
const config = require('../config/database');
const bcrypt = require('bcryptjs');


const schema = mongoose.Schema;


const personal_schema = mongoose.Schema({
    name: {type: String, required: true, trim: true},
    sales_count: {type: Number, required: true},
    contacts: {type: Number, required: true},
    conversion: {type: Number, required: true},
    date: {type: Date, default: Date.now},
    flag: {type: Boolean, default: true},
    goal_title: {type: String, required: true, trim: true},
    location: {
        latitude: {type: Number},
        longitude: {type: Number},
    },
    user_id: {type: schema.Types.ObjectId, ref: 'users'},
    // user_id: [{type: schema.Types.ObjectId, ref: 'users'}],
    // another: {type: schema.Types.ObjectId, ref: 'Story'},


});


const PersonalSales = module.exports = mongoose.model('personal_sales', personal_schema);

module.exports.getPersonalSalesById = function (id, callback) {
    PersonalSales.findById(id, callback);
};

module.exports.getAllSalesByUserId = function (userId, callback) {
    PersonalSales.find({user_id: userId}, callback);
};

module.exports.saveSales = function (req, res, next) {
    const salesCount = req.body.salesCount, contacts = req.body.contacts, commission = req.body.commission,
        conversion = req.body.conversion,
        date = req.body.date, location = req.body.location,
        userId = req.body.userId, goalTitle = req.body.goalTitle, salesName = req.body.salesName;

    if (!(salesName || salesCount || contacts || commission || conversion || location || userId || goalTitle)) {
        return res.json({
            success: false,
            message: "Required parameters are not supplied",
            code: 400,
        });
    }
    const ps = new PersonalSales();
    ps.name = salesName;
    ps.sales_count = salesCount;
    ps.contacts = contacts;
    ps.conversion = conversion;
    ps.date = date;
    ps.goal_title = goalTitle;
    ps.location = location;
    ps.user_id = userId;

    ps.save(function (err, sales) {
        if (err)
            return res.json({success: false, message: err, code: 400});
        return res.json({success: true, message: sales, code: 200});
    })


};

