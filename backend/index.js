const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const randomWord = require("./assets/randomWord.json");



const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});



const connectedSockets = new Map();

io.on("connection", (socket) => {
  console.log("New client connected");

  connectedSockets.set(socket.id, socket);

  socket.on("disconnect", () => {
    console.log("Client disconnected");

    // Remove the disconnected socket ID
    connectedSockets.delete(socket.id);
  });

  socket.on("client:getword", () => {
    const randomWordArray = randomWord.objetos;
    const randomIndex = Math.floor(Math.random() * randomWordArray.length);
    const word = randomWordArray[randomIndex];
    const socketIds = Array.from(connectedSockets.keys());
    const randomSocketId =
      socketIds[Math.floor(Math.random() * socketIds.length)];
    const randomSocket = connectedSockets.get(randomSocketId);
    if (randomSocket) {
      randomSocket.emit("server:getword", word);
    }
    io.emit("server:palabrasecreta", word);
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
      case "lapiz":
        height = 5;
        break;
      case "marcador":
        height = 10;
        break;
      case "borrador":
        height = 50;
        color = "white";
        break;
    }
    io.emit("server:option", { height, color });
  });

  socket.on("client:sendMsg", (data) => {
    let msg = data.msg.toLowerCase();
    let user = data.user;
    let palabraAdiv = data.palabraAdiv[0]?.toLowerCase();
    io.emit("server:sendMsg", { msg, user, palabraAdiv });
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
