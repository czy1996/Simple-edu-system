const ip = 'localhost';

var mongoose = require('mongoose');
"mongodb://10.57.0.92:27017/maple_pds"
var url = 'mongodb://' + ip + ':27017/jiaowu';
mongoose.Promise = global.Promise
mongoose.connect(url, function (err) {
    if (!err) {
        console.log('connected to MongoDB!');
    } else {
        throw err;
    }
});

module.exports = mongoose;
