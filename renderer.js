const { ipcRenderer } = require('electron');
// renderer.js
// import { ipcRenderer } from `${__dirname}/electron`;

const select = selector => document.querySelector(selector)

let container = select('#messages')
let progressBar = select('#progressBar')
let version = select('#version')
ipcRenderer.send('first-notif', 'Data yang dikirim dari Vue Index');

ipcRenderer.on('message', (event, text) => {

  let message = document.createElement('div')
  message.innerHTML = text
  container.appendChild(message)

})

ipcRenderer.on('isDev', (event, text) => {
  console.log(text, "is dev");
})

ipcRenderer.on('version', (event, text) => {
  console.log(text);
  version.innerText = text
})

ipcRenderer.on('download-progress', (event, text) => {
  progressBar.style.width = `${text}%`
})