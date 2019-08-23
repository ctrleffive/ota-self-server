'use strict'

const { remote } = require('electron')

document.getElementById('minimize-button').addEventListener('click', (e) => {
  const window = remote.getCurrentWindow()
  window.minimize()
})

document.getElementById('close-button').addEventListener('click', (e) => {
  const window = remote.getCurrentWindow()
  window.close()
})

const status = document.getElementById('status')

const hoursHandle = document.getElementById('hours')
const minutesHandle = document.getElementById('minutes')
const secondsHandle = document.getElementById('seconds')

const startEverything = () => {
  status.innerHTML = 'RUNNING'
  status.classList.remove('wait')
  const startTime = Date.now()
  setInterval(() => {
    let totalSeconds = Math.floor((Date.now() - startTime) / 1000)

    hoursHandle.innerHTML = ('0' + Math.floor(totalSeconds / 3600)).slice(-2)
    totalSeconds %= 3600
    minutesHandle.innerHTML = ('0' + Math.floor(totalSeconds / 60)).slice(-2)
    secondsHandle.innerHTML = ('0' + totalSeconds % 60).slice(-2)
  }, 1000)
}

setTimeout(startEverything, 1000)
