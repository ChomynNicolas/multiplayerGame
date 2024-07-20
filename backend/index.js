const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const randomWord = require("./assets/randomWords");
const User = require('./models/user.model')


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

require('./config/mongoDb.config');

io.on("connection", (socket) => {
  console.log("New client connected");
  
  const createUser = async () => {
    try {
      await User.create({ socketId: socket.id });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  createUser();

  
  socket.on("disconnect", async () => {
    console.log("Client disconnected");

    try {
      await User.findOneAndDelete({ socketId: socket.id });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  })

  socket.on("client:getword", () => {
    const random = Math.floor(Math.random() * randomWord.length);
    const wordFilter = randomWord.filter((data, ind) => ind === random);
    socket.emit("server:getword", wordFilter);
    io.emit('server:palabrasecreta', wordFilter)
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
    let msg = data.msg.toLowerCase();
    let user = data.user;

    let palabraAdiv = data.palabraAdiv[0]?.toLowerCase();

    io.emit('server:sendMsg',({msg,user,palabraAdiv}))
  })


});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
