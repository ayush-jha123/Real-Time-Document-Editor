const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const router = require('./router');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./user.js');

const app = express();
const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: 'https://real-time-document-editor.vercel.app',
    methods: ['GET', 'POST'],
  },
});

// Store content for each room
const roomContents = {};

io.on('connection', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) return callback(error);

    socket.join(user.room);

    // Initialize content for the room if it doesn't exist
    if (!roomContents[user.room]) {
      roomContents[user.room] = ''; // Default to empty content for new rooms
    }

    // Send the current room content to the newly joined user
    socket.emit('content', { content: roomContents[user.room] });

    // Notify other users in the room
    socket.broadcast.to(user.room).emit('message', {
      user: 'admin',
      text: `${user.name} has joined the room.`,
    });

    callback();
  });

  socket.on('updateContent', ({ content }) => {
    const user = getUser(socket.id);
    if (user) {
      // Update the room's content
      roomContents[user.room] = content;

      // Broadcast the updated content to all users in the room
      io.to(user.room).emit('content', { content: roomContents[user.room] });
    }
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', {
        user: 'admin',
        text: `${user.name} has left.`,
      });

      // Optionally, clean up room content if the room becomes empty
      if (getUsersInRoom(user.room).length === 0) {
        delete roomContents[user.room];
      }
    }
  });
});

app.use(router);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
