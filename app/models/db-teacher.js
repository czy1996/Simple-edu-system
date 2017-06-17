
var path = require('path');

// console.log(' __dirname : ' + __dirname);
// console.log('__filename : ' + __filename);
// console.log('    process: ' + path.resolve(process.cwd()));

console.log('./ : ' + path.resolve('./'));

var mongoose = require('./db.js');

var db = mongoose.connection;
var TeacherSchema = new mongoose.Schema({
    teacherId: { type: String },
    name: { type: String },
    password: { type: String }
    });


TeacherSchema.statics.getTeacherById = function(id, cb){
  return this.findOne({teacherId: id}, cb)
};

var TeacherModel = db.model('teacherinfo', TeacherSchema);




/*
var StudentModel =db.StudentModel
StudentModel.find(function (err, docs) {
    if (!err) {
        console.log(docs);
    }
})
*/
module.exports = TeacherModel
// // 返回 Promise 对象
// var promise = StudentModel.find(function (err, docs) {
//     if (!err) {
//         console.log(docs);
//     }
// }).exec();



var TestEntity = new TeacherModel({
    teacherId: '1733',
    name: '李明',
    password: '123'
});

// TestEntity.save();
