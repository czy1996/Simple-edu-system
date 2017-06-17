var path = require('path');
var mongoose = require('./db.js');

var db = mongoose.connection;
var ScoreSchema = new mongoose.Schema({
    // 2016-10-12-
    courseId: { type: String },       // 考试 ID
    studentId: { type: String },         // 学生姓名
    score: { type: Number },      // 考试成绩
    /*
    科目ID： {
            满分：
            成绩：
        }
    */
});

ScoreSchema.statics.getScoresByStudentId = function(studentId, cb){
  return this.find({
    studentId: studentId
  }, cb)
}

ScoreSchema.statics.getScoresByStudentIdAndCourseId = function(studentId,courseId, cb){
  return this.findOne({
    studentId: studentId,
    courseId: courseId,
  }, cb)
}

ScoreModel = db.model('scoreinfos', ScoreSchema)
module.exports = ScoreModel



var test = [
    {
        value: '001',
        text: '语文',
        grade: ['201601', '201602']
    }
]
/*
日常：根据老师所教的班级、科目生成
周清：根据老师所教的班级、科目生成
月考：默认（语文、数学、中英、外英；全年级）
统考：默认（语文、数学、中英、外英；全年级）
*/
var TestEntity = new ScoreModel({
  courseId: '1497580564110',
  studentId: '2014011493',
  score: 97,
})

// TestEntity.save()
