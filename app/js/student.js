var ScoreModel = require('../models/db-score.js')
var CourseModel = require('../models/db-course.js')
const {ipcRenderer, remote} = require('electron')

var quitBtn = e('#id-btn-quit')
bindEvent(quitBtn, 'click', function() {
  remote.getCurrentWindow().close()
})

var appendHtmlAsync = (scoreBody, courseId, score) => {
  var cName = {}
  log(courseId)
  CourseModel.getCourseById(courseId, (err, res) => {
    cName = res.name
    log(cName)
    var tr = `<tr>
      <td>${cName}</td>
      <td>${score}</td>
    </tr>`
    appendHtml(scoreBody, tr)
  })

}

bindEvent(document, 'DOMContentLoaded', () => {
  ipcRenderer.on('studentLogin', (event, params) => {
    log('received')
    log(params)
    ScoreModel.getScoresByStudentId(params.id, (err, res) => {
      log(res)
      scoreBody = e('#score-tbody')
      for (var i = 0; i < res.length; i++) {
        appendHtmlAsync(scoreBody, res[i].courseId, res[i].score)
      }
    })
  })

})
