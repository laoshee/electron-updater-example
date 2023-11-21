const {app,BrowserWindow,ipcMain} = require('electron')
const path = require('path')
const {autoUpdater} = require('electron-updater')
const log = require('electron-log');
log.transports.file.resolvePath = () => path.join('C:/xampp8.1.10/htdocs/newcoba/electron/auto-update-electron-master/', '/logs/main.log');
log.info('Hello, log');
log.warn('Some problem appears');
const appVersion = app.getVersion();

const isDev = require('electron-is-dev');
// const { autoUpdater } = isDev ? require('electron-updater') : null;

let win;
const dispatch = (data) => {
    win.webContents.send('message', data)
}
function createWindow(){
win = new BrowserWindow({width:300,height:400,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
    }
})
// const feedURL = 'file:///path/to/your/local/repo';

autoUpdater.updateConfigPath = path.join(__dirname, 'dev-app-update.yml');
console.log(path.join(__dirname, 'dev-app-update.yml'))

win.loadFile(path.join(__dirname,'index.html'))
}

app.on('ready',()=>{
    createWindow()
    autoUpdater.checkForUpdatesAndNotify()
})
ipcMain.on('first-notif', (event, data) => {
    if (!win.isDestroyed()) {
        win.webContents.send('versi-aplikasi', 'v'+ appVersion);
        win.webContents.send('version', 'v'+ appVersion);
        win.webContents.send('isDev', isDev);
    }
});

autoUpdater.on('checking-for-update', () => {
    dispatch('Checking for update...')
    log.info("checking-for-update")
  })
  
  autoUpdater.on('update-available', (info) => {
    dispatch('Update available.')
    log.info("update-available")
    })
  
  autoUpdater.on('update-not-available', (info) => {
    dispatch('Update not available.')
  })
  
  autoUpdater.on('error', (err) => {
    dispatch('Error in auto-updater. ' + err)
  })
  
  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')'
    dispatch(log_message)
    log.info("download-progress")
  
    win.webContents.send('size', log_message)
    win.webContents.send('download-progress', progressObj.percent)
  
  })
  
  autoUpdater.on('update-downloaded', (info) => {
    dispatch('Update downloaded')
    log.info("update-downloaded")
  })
  