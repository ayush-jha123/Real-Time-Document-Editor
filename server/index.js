const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const router = require('./router');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./user.js');

const app = express();
const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'],
  },
});

let notebookContent = ''; 

io.on('connection', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) return callback(error);

    socket.join(user.room);

    
    socket.emit('content', { content: notebookContent });

    
    socket.broadcast.to(user.room).emit('message', {
      user: 'admin',
      text: `${user.name} has joined the room.`,
    });

    callback();
  });

  
  socket.on('updateContent', ({ content }) => {
    notebookContent = content; 
    io.to(getUser(socket.id).room).emit('content', { content: notebookContent }); 
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', {
        user: 'admin',
        text: `${user.name} has left.`,
      });
    }
  });
});

app.use(router);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
