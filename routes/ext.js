const multer = require('multer');
const path = require('path');
const uuidv1 = require('uuid/v1');


const storage1 = multer.diskStorage({
    // destination: '../uploads/content/images/',
    destination: path.join(__dirname, '../public/content/images/'),
    filename: function (req, file, callback) {
        callback(null, uuidv1() + "-" + path.extname(file.originalname));
    },/* filter: checkFileTypeImage(file, function (err, something) {

    })*/
});

function checkFileTypeImage(file, callback) {
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
module.exports = multer({storage: storage1}).array('userPhoto', 2);
