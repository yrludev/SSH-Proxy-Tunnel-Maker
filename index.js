const fs = require('fs');
const net = require('net');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const LOCAL_HOST = config.local.host;
const LOCAL_PORT = config.local.port;
const REMOTE_HOST = config.remote.host;
const REMOTE_PORT = config.remote.port;

// Object to track active connections by IP address
const activeConnections = {};

const server = net.createServer((localSocket) => {
  const clientIP = localSocket.remoteAddress;

  // Check if the client already has an active connection
  if (activeConnections[clientIP]) {
    console.log(`Connection from ${clientIP} rejected (already connected)`);
    localSocket.end(); // Reject the connection
    return;
  }

  console.log(`Incoming connection from: ${clientIP}:${localSocket.remotePort}`);

  activeConnections[clientIP] = true;


  const remoteSocket = net.createConnection(REMOTE_PORT, REMOTE_HOST, () => {
    console.log(`Connected to remote server: ${REMOTE_HOST}:${REMOTE_PORT}`);
  });

  // Pipe data between the local and remote sockets
  localSocket.pipe(remoteSocket);
  remoteSocket.pipe(localSocket);

  // Handle errors on the local connection
  localSocket.on('error', (err) => {
    console.error(`Local socket error from ${clientIP}:`, err);
    remoteSocket.end(); // End the connection if local socket has an error
  });

  // Handle errors on the remote connection
  remoteSocket.on('error', (err) => {
    console.error(`Remote socket error to ${REMOTE_HOST}:${REMOTE_PORT}:`, err);
    localSocket.end(); // End the connection if remote socket has an error
  });

  // Mark the IP as no longer having an active connection when it ends
  localSocket.on('end', () => {
    remoteSocket.end();
    delete activeConnections[clientIP]; // Remove the IP from active connections
    console.log(`Connection from ${clientIP} ended`);
  });

  remoteSocket.on('end', () => {
    localSocket.end();
    delete activeConnections[clientIP]; // Remove the IP from active connections
    console.log(`Remote connection to ${clientIP} ended`);
  });
});

// Start the proxy server
server.listen(LOCAL_PORT, LOCAL_HOST, () => {
  console.log(`Proxy server listening on ${LOCAL_HOST}:${LOCAL_PORT}...`);
});

// Optional: Increase the maximum number of simultaneous connections
server.maxConnections = 10000; // Adjust this as necessary based on your system's capacity
