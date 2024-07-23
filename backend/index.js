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
const users = {};

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
  const maxPlayerFin = maxPlayers;
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

    if (room) {
      if (room.players.length < room.maxPlayerFin) {
        const color = getRandomColor();
        room.players.push({ id: socket.id, name: playerName, color: color, points: 0 });
        socket.join(roomId);
        io.to(roomId).emit("player-joined", room.players);
        users[socket.id] = { color, roomId, playerName };
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
    const user = users[socket.id];
    if (user) {
      const room = rooms[user.roomId];
      if (room) {
        room.players = room.players.filter((player) => player.id !== socket.id);
        if (room.players.length === 0) {
          delete rooms[user.roomId];
        } else {
          io.to(user.roomId).emit("player-left", room.players);
        }
      }
      delete users[socket.id];
    }
    connectedSockets.delete(socket.id);
  });

  socket.on("client:getword", () => {
    const user = users[socket.id];

    if (user) {
      const randomWordArray = randomWord.objetos;
      const randomIndex = Math.floor(Math.random() * randomWordArray.length);
      const word = randomWordArray[randomIndex];

      const usersInSameRoom = Object.keys(users).filter(
        (key) => users[key].roomId === user.roomId
      );

      const randomNun = Math.floor(Math.random() * usersInSameRoom.length);

      const randomSocketId = usersInSameRoom[randomNun];

      const randomSocket = connectedSockets.get(randomSocketId);

      if (randomSocket) {
        randomSocket.emit("server:getword", word);
      }

      const roomId = user.roomId;
      io.to(roomId).emit("server:palabrasecreta", word);
    }
  });

  socket.on("client:dibujando", (data) => {
    const user = users[socket.id];
    if (user) {
      io.to(user.roomId).emit("server:dibujando", data);
    }
  });

  socket.on("client:limpiar", () => {
    const user = users[socket.id];
    if (user) {
      io.to(user.roomId).emit("server:limpiar", true);
    }
  });

  socket.on("client:color", (color) => {
    const user = users[socket.id];
    if (user) {
      io.to(user.roomId).emit("server:color", color);
    }
  });

  socket.on("client:options", (option) => {
    const user = users[socket.id];
    if (user) {
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
      io.to(user.roomId).emit("server:option", { height, color });
    }
  });

  socket.on("client:sendMsg", (data) => {
    const usuario = users[socket.id];
    if (usuario) {
      const msg = data.msg;
      const user = usuario.playerName;
      const palabraAdiv = data.palabraAdiv;
      const usuarioColor2 = usuario.color;

      io.to(usuario.roomId).emit("server:sendMsg", {
        user,
        msg,
        palabraAdiv,
        usuarioColor2,
      });
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
