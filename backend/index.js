const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { v4: uuidv4 } = require("uuid");
const randomWord = require("./assets/randomWord.json");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const rooms = {};
let users = {};

const predefinedColors = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#F0F333",
  "#F333F0",
  "#33F0F0",
  "#F0A333",
  "#33F0A3",
  "#A333F0",
  "#F0A3A3",
  "#00FF00",
  "#1E90FF",
  "#FFD700",
  "#FF1493",
  "#00FFFF",
  "#FF4500",
  "#DA70D6",
  "#FF6347",
  "#4682B4",
  "#D2691E",
  "#ADFF2F",
  "#FF00FF",
  "#7FFF00",
  "#FFB6C1",
  "#6495ED",
  "#FF00FF",
  "#32CD32",
  "#40E0D0",
  "#FF1493",
];

app.use(express.json(), cors());

function generateRoomId() {
  return uuidv4().replace(/-/g, "").slice(0, 5);
}

app.post("/create-room", (req, res) => {
  const { maxPlayers } = req.body;
  const maxPlayerFin = maxPlayers * 2;
  const roomId = generateRoomId();
  rooms[roomId] = { players: [], maxPlayerFin };
  res.json({ roomId });
});

const connectedSockets = new Map();

io.on("connection", (socket) => {
  console.log("New client connected");

  const getRandomColor = () => {
    return predefinedColors[
      Math.floor(Math.random() * predefinedColors.length)
    ];
  };

  socket.on("join-room", ({ roomId, playerName }) => {
    const room = rooms[roomId];
    console.log(room);
    if (room) {
      if (room.players.length < room.maxPlayerFin) {
        room.players.push(playerName);
        socket.join(roomId);
        io.to(roomId).emit("player-joined", room.players);
        const color = getRandomColor();
        users[socket.id] = color;

        socket.emit("setColor", color);
      } else {
        socket.emit("room-full");
      }
    } else {
      socket.emit("room-not-found");
    }
  });

  connectedSockets.set(socket.id, socket);

  socket.on("disconnect", () => {
    console.log("Client disconnected");

    for (const roomId in rooms) {
      const room = rooms[roomId];
      const playerIndex = room.players.indexOf(socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        io.to(roomId).emit("player-left", room.players);
      }
    }

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
    let msg = data.msg;
    let user = data.user;
    let palabraAdiv = data.palabraAdiv;
    let usuarioColor2 = data.usuarioColor
    
    io.emit("server:sendMsg", { msg, user, palabraAdiv,usuarioColor2 });
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
