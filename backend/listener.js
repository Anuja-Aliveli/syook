const http = require('http');
const socketIo = require('socket.io');

const LISTENER_PORT = 5002; // Port for the listener server

// Create a basic HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Listener Server\n');
});

const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('Listener: A client has connected');

  // Listen for data emitted by the emitter server
  socket.on('emitterData', (data) => {
    console.log('Listener: Received data from emitter:', data);
    // Process and handle the received data as needed
  });

  socket.on('disconnect', () => {
    console.log('Listener: A client has disconnected');
  });
});

server.listen(LISTENER_PORT, () => {
  console.log(`Listener server is listening on port ${LISTENER_PORT}`);
});
