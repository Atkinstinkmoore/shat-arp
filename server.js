const express = require("express");
const path = require("path")
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages")
const {userJoin, getCurrentUser, removeUser, getUsersInRoom} = require("./utils/users")

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

const BOTNAME = "ARP-Darp the bot";

io.on("connection", socket => {

  socket.on("joinRoom", (username) => {
      const user = userJoin(socket.id, username);

      socket.join(user.room);

      socket.emit("message", formatMessage(`${BOTNAME}`, `Välkommen till Shat ARP ${user.username}`));

      socket.to(user.room).emit("message", formatMessage(`${BOTNAME}`, `${username} har anslutit till chatten`));

      io.emit("roomUsers", {
        room: user.room,
        users: getUsersInRoom(user.room)
      });

    });
    socket.on("chatMessage", (msg) => {
      const user = getCurrentUser(socket.id);
      io.to(user.room).emit("message", formatMessage(`${user.username}`, msg));
    });

    socket.on("disconnect", () => {
      const user = removeUser(socket.id);
      if(user){
        io.emit("message", formatMessage(`${BOTNAME}`, `${user.username} har lämnat chatten`));

        io.emit("roomUsers", {
          user: getUsersInRoom(user.room)
        });
      }
    });
  });






const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});