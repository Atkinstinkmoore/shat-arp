const express = require("express");
const path = require("path")
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", socket => {

  socket.emit("message", "Välkommen till Shat ARP");

  socket.broadcast.emit("message", "En användare har anslutit till chatten");

  socket.on("disconnect", () => {
    io.emit("message", "En användare har lämnat chatten");
  })
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});