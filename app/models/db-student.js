
var path = require('path');

// console.log(' __dirname : ' + __dirname);
// console.log('__filename : ' + __filename);
// console.log('    process: ' + path.resolve(process.cwd()));

console.log('./ : ' + path.resolve('./'));

var mongoose = require('./db.js');

var db = mongoose.connection;
var StudentSchema = new mongoose.Schema({
    studentId: { type: String },
    name: { type: String },
    password: { type: String }
    });

StudentSchema.statics.getStudentById = function(id, cb){
  return this.findOne({studentId: id}, cb)
};

StudentSchema.statics.getStudentsAll = function(cb){
  return this.find({}, cb)
};
// // assign a function to the "statics" object of our animalSchema
// animalSchema.statics.findByName = function(name, cb) {
//   return this.find({ name: new RegExp(name, 'i') }, cb);
// };
//
// var Animal = mongoose.model('Animal', animalSchema);
// Animal.findByName('fido', function(err, animals) {
//   console.log(animals);
// });

var StudentModel = db.model('studentinfo', StudentSchema);



/*
var StudentModel =db.StudentModel
StudentModel.find(function (err, docs) {
    if (!err) {
        console.log(docs);
    }
})
*/
module.exports = StudentModel;
// // 返回 Promise 对象
// var promise = StudentModel.find(function (err, docs) {
//     if (!err) {
//         console.log(docs);
//     }
// }).exec();



var TestEntity = new StudentModel({
    studentId: '2014011493',
    name: '张XX',
    password: '123'
});

// TestEntity.save();
