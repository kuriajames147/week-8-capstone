// server.js
const app = require('./app');
const http = require('http');
const socketio = require('socket.io');
const connectDB = require('./config/db');
const { socketHandler } = require('./socket');

const server = http.createServer(app);
const io = socketio(server);

// Connect to database
connectDB();

// Socket.io setup
socketHandler(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});