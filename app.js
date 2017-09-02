const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')

const os = require('os-utils')

app.set('port', 3000)
app.use(express.static(path.join(__dirname, 'public/')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'))
})

io.on('connection', socket => {
  console.log('User Connected')

  socket.on('disconnect', () => {
    clearInterval(getCPUStats)
    console.log('User Disconnected')
  })
  
  let getCPUStatus = setInterval(() => {
    os.cpuUsage(v => {
      let percentage = (Math.floor(v * 100))

      io.emit('cpu-data', percentage)
      console.log(`Emitting data // CPU USAGE: ${percentage}%`, v)
    })
  }, 1000);
})

http.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`)
})