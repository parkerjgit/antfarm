const Message = require('../db/models/message');
const Channel = require('../db/models/channel');

const inMemoryDrawHistory = [];

module.exports = io => {

  io.on('connection', socket => {

    console.log(socket.id, ' has made a persistent connection to the server!');

    socket.on('new-message', message => {
      socket.broadcast.emit('new-message', message);
    });

    socket.on('new-channel', channel => {
      socket.broadcast.emit('new-channel', channel);
    });

    // ---

    if (inMemoryDrawHistory.length) socket.emit('load', inMemoryDrawHistory)

    socket.on('addVoxel', (point, color) => {
      inMemoryDrawHistory.push({ point, color })
      socket.broadcast.emit('someOneDrew', point, color)
    })

    socket.on('disconnect', () => {
      console.log('Goodbye, ', socket.id, ' :(')
    })

    // ---

  });

};


// ----------

// const path = require('path')
// const express = require('express')
// const app = express()
// const socketio = require('socket.io')

// // app.listen() returns an http.Server object
// // http://expressjs.com/en/4x/api.html#app.listen
// const server = app.listen(1337, () => {
//   console.log(`Listening on http://localhost:${server.address().port}`)
// })

// const io = socketio(server)

// const inMemoryDrawHistory = []

// io.on('connection', socket => {
//   console.log('A new client has connected!')
//   console.log(socket.id)

//   if (inMemoryDrawHistory.length) socket.emit('load', inMemoryDrawHistory)

//   socket.on('addVoxel', (point, normal, color) => {
//     inMemoryDrawHistory.push({ point, normal, color })
//     socket.broadcast.emit('someOneDrew', point, normal, color)
//   })

//   socket.on('disconnect', () => {
//     console.log('Goodbye, ', socket.id, ' :(')
//   })
// })

//app.use(express.static(path.join(__dirname, 'public')))
