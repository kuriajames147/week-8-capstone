// socket/index.js
const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected');
    
    // Join team rooms
    socket.on('joinTeams', (teams) => {
      teams.forEach(team => {
        socket.join(team);
      });
    });
    
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

module.exports = { socketHandler };