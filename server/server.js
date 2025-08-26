const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});


require('dotenv').config();
const mongoURL = process.env.MONGO_URI;
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Document = mongoose.model('Document', new mongoose.Schema({
  _id: String,
  data: Object
}));


io.on('connection', socket => {
  // ...existing code...
  socket.on('get-document', async documentId => {
    currentDoc = documentId;
    const document = await Document.findById(documentId) || await Document.create({ _id: documentId, data: '' });
    socket.join(documentId);
    socket.emit('load-document', document.data);

  // ...existing code...


    socket.on('send-changes', delta => {
      socket.broadcast.to(documentId).emit('receive-changes', delta);
    });


    // Collaborative cursor relay
    socket.on('send-cursor', data => {
      socket.broadcast.to(documentId).emit('receive-cursor', data);
    });

    // Remove cursor when user disconnects
    socket.on('disconnect', () => {
      socket.broadcast.to(documentId).emit('receive-cursor', {
        userId: socket.id,
        username: '',
        range: null,
        color: ''
      });
    });

    socket.on('save-document', async data => {
      await Document.findByIdAndUpdate(documentId, { data });
    });

  // ...existing code...
  });
});

server.listen(5000, () => {
  console.log('Server started on port 5000');
});
