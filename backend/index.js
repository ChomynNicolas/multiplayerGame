const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const randomWord = require('./assets/randomWords')
const app = express();
const server = http.createServer(app);
const io = socketIo(server,{
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('client:getword', () => {
    io.emit('server:getword', randomWord);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));