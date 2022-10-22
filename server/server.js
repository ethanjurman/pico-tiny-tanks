const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// host the static files (tiny-tanks.html, etc...)
app.use(express.static(path.join(__dirname, '../')));
// default any route to tiny-tanks.html
app.use((__req, res) => res.sendFile(path.join(__dirname, '../tiny-tanks.html')));

// host on port 5000, or if being served by a service, they can choose via process.env.PORT
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server Running \nhttp://localhost:${PORT}`));

// socket is a connection between the server and the client
io.on('connection', (socket) => {
  let roomId;
  socket.on('disconnect', () => { });
  // attach a room id to the socket connection
  socket.on('room_join', (evtData) => {
    socket.join(evtData.roomId);
    roomId = evtData.roomId;
  })
  // when the server recives an update from the client, send it to every client with the same room id
  socket.on('tank_update', (updatedTankData) => {
    socket.to(roomId).volatile.emit('tank_update_from_server', updatedTankData);
  });
});