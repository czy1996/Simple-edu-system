
var path = require('path');

var mongoose = require('./db.js');

var db = mongoose.connection;
var CourseSchema = new mongoose.Schema({
    courseId: { type: String },
    teacherId: { type: String },
    name: { type: String },
});

CourseSchema.statics.getCourseById = function(id, cb){
  return this.findOne({courseId: id}, cb)
};

CourseSchema.statics.getCoursesByTeacherId = function(id, cb){
  return this.find({teacherId: id}, cb)
};

var CourseModel = db.model('courseinfos', CourseSchema);

var test = [{ id: 2015, text: "语文"  }]

/*
var CourseModel =db.CourseModel
CourseModel.find(function (err, docs) {
    if (!err) {
        console.log(docs);
    }
})


var Model =  db.CourseModel;
Model.findOneAndRemove({courseId:'001'})
Model.findOneAndRemove({courseId:'001'},function(err,vals){console.log(err,vals)})
*/
module.exports = CourseModel
// // 返回 Promise 对象
// var promise = CourseModel.find(function (err, docs) {
//     if (!err) {
//         console.log(docs);
//     }
// }).exec();



var TestEntity = new CourseModel({ courseId: 2015,
    name: "油层物理",
    teacherId: 1732,
  });

// TestEntity.save();
