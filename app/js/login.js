const {ipcRenderer, remote} = require('electron')

var quitBtn = e('#id-btn-quit')
bindEvent(quitBtn, 'click', function() {
  remote.getCurrentWindow().close()
})

var switcherStudent = e('#id-a-student')
var switcherTeacher = e('#id-a-teacher')
var formStudent = e('.form-student')
var formTeacher = e('.form-teacher')

bindEvent(switcherStudent, 'click', function(){
  if (formStudent.classList.contains('form-active')) {
    return
  }else {
    toggleClass(switcherStudent, 'active')
    toggleClass(switcherTeacher, 'active')
    toggleClass(formStudent, 'form-active')
    toggleClass(formTeacher, 'form-active')
  }
})

bindEvent(switcherTeacher, 'click', function(){
  if (formTeacher.classList.contains('form-active')) {
    return
  }else {
    toggleClass(switcherStudent, 'active')
    toggleClass(switcherTeacher, 'active')
    toggleClass(formStudent, 'form-active')
    toggleClass(formTeacher, 'form-active')
  }
})

bindAll('.button-submit', 'click', function(event){
  log('click')
  var button = event.target
  var form = button.closest('form')
  log(form)
  var userType = find(form, '.userType').value
  var id = find(form, '.id').value
  var password = find(form, '.password').value
  var params = {
    userType: userType,
    id: id,
    password: password,
  }
  // log(params)
  ipcRenderer.send('login', params)
})
