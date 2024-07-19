const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const randomWord = require("./assets/randomWords");
const { stringify } = require("querystring");
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("client:getword", () => {
    io.emit("server:getword", randomWord);
  });

  socket.on("client:dibujando", (data) => {
    io.emit("server:dibujando", data);
  });

  socket.on("client:limpiar", () => {
    io.emit("server:limpiar", true);
  });

  socket.on("client:color", (color) => {
    io.emit("server:color", color);
  });

  socket.on("client:options", (option) => {
    let height;
    let color;
    
    switch (option) {
      case "lapiz": {
        
        height = 5;
        break;
      }
      case "marcador": {
        height = 10;
        break;
      }
      case "borrador": {
        height = 50;
        color = "white"
        break;
      }
    }
    io.emit("server:option",({height,color}));
  });

  socket.on('client:sendMsg',(data)=>{
    io.emit('server:sendMsg',(data))
  })


});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
