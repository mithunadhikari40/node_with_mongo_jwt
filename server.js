let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let morgan = require('morgan');
let mongoose = require('mongoose');
let cors = require('cors');
let path = require('path');
let passport = require('passport');
let multer = require('multer');
const fs = require('fs');
const https = require('https');

let config = require('./config/database');
let port = process.env.port || 5000;


mongoose.connect(
    config.db, {
        useNewUrlParser: true
    }
);
mongoose.Promise = global.Promise;

require('./config/passport')(passport);
// require('./config/passport')(app,passport);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
// app.use(port());
app.use(cors());
// app.use(multer());
app.use(express.static(__dirname));
app.use(passport.initialize());
app.use(passport.session());
require('./routes/routes')(app, passport);
const httpsOptions = {
    /*
    key: fs.readFileSync('./security/cert.key'),
    cert: fs.readFileSync('./security/cert.pem')*/


    key: fs.readFileSync(__dirname + '/security/cert.key','utf8'),
    cert: fs.readFileSync(__dirname + '/security/cert.pem','utf8')
};


const server = https.createServer(httpsOptions, app)
    .listen(port, () => {
        console.log('server running at ' + port)
    });
/*

app.listen(port, function () {
    console.log(`Server is listening on ${port}`);
});*/
