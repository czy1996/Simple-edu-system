const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
var StudentModel = require('./models/db-student.js')
var TeacherModel = require('./models/db-teacher.js')


// 保持一个对于 window 对象的全局引用，如果你不这样做，
// 当 JavaScript 对象被垃圾回收， window 会被自动地关闭
let win

function createWindow () {
  // 创建浏览器窗口。
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, // 取消边框
  })

  // 加载应用的 index.html。
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // 打开开发者工具。
  // win.webContents.openDevTools()

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null
  })
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在这文件，你可以续写应用剩下主进程代码。
  // 也可以拆分成几个文件，然后用 require 导入。
  if (win === null) {
    createWindow()
  }
})

// 在这文件，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。
var checkLogin = function(params){
  if(params.userType == '学生'){
    console.log(StudentModel)
    StudentModel.getStudentById(params.id, function(err, res){
      console.log(res.password, typeof res);
      if (res.password == params.password) {
        console.log('登录成功');
        // 跳转页面
        console.log(path.join(__dirname, 'html/student.html'));
        win.loadURL(url.format({
          pathname: path.join(__dirname, 'html/student.html'),
          protocol: 'file:',
          slashes: true
        }))
        win.webContents.on('did-finish-load', () => {
          win.webContents.send('studentLogin', params)
        })

      }
    })
  }else if(params.userType == '教师'){
    TeacherModel.getTeacherById(params.id, function(err, res){
      console.log(res, res.password);
      if(res.password == params.password) {
        console.log('登陆成功')

        console.log(path.join(__dirname, 'html/teacher.html'));
        win.loadURL(url.format({
          pathname: path.join(__dirname, 'html/teacher.html'),
          protocol: 'file:',
          slashes: true
        }))
        win.webContents.on('did-finish-load', () => {
          win.webContents.send('teacherLogin', params)
        })
      }
    })
  }

}


ipcMain.on('login', (event, params) => {
  // params: object
  console.log('login clicked', params, typeof params);
  checkLogin(params)
})
