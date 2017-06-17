var ScoreModel = require('../models/db-score.js')
var CourseModel = require('../models/db-course.js')
var TeacherModel = require('../models/db-teacher.js')
var StudentModel = require('../models/db-student.js')

const {ipcRenderer, remote} = require('electron')

var quitBtn = e('#id-btn-quit')
bindEvent(quitBtn, 'click', function() {
  remote.getCurrentWindow().close()
})

var appendHtmlAsync = (courseBody, courseId) => {
  var cName = {}
  log(courseId)
  CourseModel.getCourseById(courseId, (err, res) => {
    cName = res.name
    log(cName)
    var tr = `<tr>
      <td>${cName}</td>
    </tr>`
    appendHtml(courseBody, tr)
  })

}

var bindEventCourseLoad = () => {
  bindEvent(document, 'DOMContentLoaded', () => {
    ipcRenderer.on('teacherLogin', (event, params) => {
      log('received')
      log(params)
      teacher = e('#id-teacher')
      teacher.value = params.id
      CourseModel.getCoursesByTeacherId(params.id, (err, res) => {
        log(res)
        scoreBody = e('#course-tbody')
        for (var i = 0; i < res.length; i++) {
          appendHtmlAsync(scoreBody, res[i].courseId)
        }
      })
    })
  })
}

var insertCourse = () => {
  var tr = `<tr>
    <td class='new-course'></td>
  </tr>`
  var courseBody = e('#course-tbody')
  appendHtml(courseBody, tr)
  var newCourse = e('.new-course')
  newCourse.contentEditable = true
  newCourse.focus()
}

var appendCoursesNav = (container, courseId) => {
  CourseModel.getCourseById(courseId, (err, res) => {
    cName = res.name
    log(cName)
    var tr = `<li class="list-group-item course-item" data-courseId='${courseId}'>
      <div class="media-body course-item">
        <span class="icon icon-book pull-left media-object"></span>
        <strong class='course-item'>${cName}</strong>
      </div>
    </li>`
    appendHtml(container, tr)
  })
}

var clearAllitems = (container, selector) => {
  items = container.querySelectorAll(selector)
  for (var i = 0; i < items.length; i++) {
    items[i].remove()
  }
}

var loadCourses = () => {
  var container = e('#nav-courses')
  var teacherId = e('#id-teacher').value
  CourseModel.getCoursesByTeacherId(teacherId, (err, res) => {
    log(res)
    var container = e('#nav-courses')
    container = find(container, 'ul')
    clearAllitems(container, '.list-group-item')
    for (var i = 0; i < res.length; i++) {
      appendCoursesNav(container, res[i].courseId)
    }
  })

}

var bindEventCourseAdd = () => {
  var buttonAdd = e('#btn-course-add')
  bindEvent(buttonAdd, 'click', () => {
    log('add clicked')
    insertCourse()
  })
}

var bindEventCourseUpdate = () => {
  var courseBody = e('#course-tbody')
  bindEvent(courseBody, 'keydown', (event) => {
    var self = event.target
    if(self.classList.contains('new-course')){
      if(event.key == 'Enter') {
        log('按了回车键')
        event.preventDefault()
        self.contentEditable = false
        self.classList.remove('new-course')
        id = String(Date.now())
        teacher = e('#id-teacher')
        var data = {
          name: self.innerHTML,
          courseId: id,
          teacherId: teacher.value,
        }
        var entity = new CourseModel(data)
        entity.save()
      }
    }
  })
}

var bindEventSwichNav = () => {
  bindAll('.nav-group-item', 'click', event => {
    var self = event.target
    if(self.classList.contains('active')){
      return
    }else {
      var container = self.closest('.nav-group')
      var former = find(container, '.active')
      toggleClass(former, 'active')
      toggleClass(self, 'active')
      log(former.dataset.pane)
      formerPane = e('.'+former.dataset.pane)
      nextPane = e('.'+self.dataset.pane)
      toggleClass(formerPane, 'hide')
      toggleClass(nextPane, 'hide')
      loadCourses()
    }
  })
}

var insertScore = (tbody, courseId, stu) => {
  ScoreModel.getScoresByStudentIdAndCourseId(stu.studentId, courseId, (err, res) => {

    log('score***', res)
    if(res != null) {
      var tr = `<tr data-studentId='${stu.studentId}'>
        <td class='score-studentname'>${stu.name}</td>
        <td class='score-score'>${res.score}</td>
      </tr>`
      appendHtml(tbody, tr)
    }else {
      var tr = `<tr data-studentId='${stu.studentId}'>
        <td class='score-studentname'>${stu.name}</td>
        <td class='score-score'></td>
      </tr>`
      appendHtml(tbody, tr)
    }
  })

}

var loadStudents = courseId => {
  tbody = e('#score-tbody')
  clearAllitems(tbody, 'tr')
  StudentModel.getStudentsAll((err, res) => {
    log(res)
    for (var i = 0; i < res.length; i++) {
      insertScore(tbody, courseId, res[i])
    }
  })
}

var loadScores = courseId => {
  var tbody = e('#score-tbody')
  log(tbody)
  var trs = tbody.querySelectorAll('tr')
  log('***trs',trs)
  for (var i = 0; i < trs.length; i++) {
    var studentId = trs[i].dataset.studentId
    ScoreModel.getScoresByStudentIdAndCourseId(studentId, courseId, (err, res) => {
      log('score***', res)
      trs[i].querySelector('.score-score').innerHTML = res.score
    })
  }
}

var bindEventSwichCourse = () => {
  var container = e('.list-group')
  bindEvent(container, 'click', event => {
    var self = event.target
    var container = e('.list-group')
    log('clicked nav')
    if (self.classList.contains('.active')) {
      return
    }else{
      log('else')
      log(self)
      if (self.classList.contains('course-item')) {
        log(container, 'shit')
        if(find(container, '.active') != null){
          log(self)
          former = find(container, '.active')
          toggleClass(former, 'active')

        }
        toggleClass(self.closest('.list-group-item'), 'active')
        loadStudents(self.closest('.list-group-item').dataset.courseid)
        // loadScores()

      }
    }
  })
}

var bindEventEditScore = () => {
  var container = e('#score-tbody')
  container.addEventListener('click', event => {
    var self = event.target
    if (self.classList.contains('score-score')) {
      self.contentEditable = true
      self.focus()
    }
  })
}

var bindEventUpdateScore = () => {
  var container = e('#score-tbody')
  container.addEventListener('keydown', event => {
    var self = event.target
    if (self.classList.contains('score-score')) {
      if (event.key == 'Enter') {
        event.preventDefault()
        self.contentEditable = false
        var studentId = self.closest('tr').dataset.studentid
        var courseId = e('#nav-courses').querySelector('.active').dataset.courseid
        var query = {
          studentId: studentId,
          courseId: courseId,
        }
        var update = {
          score: Number(self.innerHTML)
        }
        log(query)
        ScoreModel.findOneAndUpdate(query, update, (err, res) => {
          log('更新成功', res)
          if (res == null) {
            var entity = new ScoreModel({
              studentId: query.studentId,
              courseId: courseId,
              score: Number(self.innerHTML),
            })
            entity.save()
          }
        })

      }
    }
  })
}

var bindEvents = () => {
  bindEventCourseLoad()
  bindEventCourseAdd()
  bindEventCourseUpdate()
  bindEventSwichNav()
  bindEventSwichCourse()
  bindEventEditScore()
  bindEventUpdateScore()
}

bindEvents()
