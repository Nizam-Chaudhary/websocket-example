const WebSocket = require('ws')
const express = require('express')
const app = express()
const path = require('path')

app.use('/', express.static(path.resolve(__dirname, './client')))

const myServer = app.listen(9876)

const wsServer = new WebSocket.Server({
  noServer: true
})

wsServer.on("connection", (ws) => {
  console.log('connected to websocket')
  ws.on("message", (msg) => {
    wsServer.clients.forEach((client) => {
      console.log('MESSAGE: ', msg.toString())
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg.toString())
      }
    })
  })
})

// Listen for HTTP upgrade requests and handle WebSocket connections
myServer.on('upgrade', (req, socket, head) => {
  // Check if the upgrade request matches the desired path (/device-socket)
  if (req.url === '/device-socket') {
    // Handle WebSocket connection upgrade
    wsServer.handleUpgrade(req, socket, head, (ws) => {
      wsServer.emit('connection', ws, req);
    });
  } else {
    // If the path is not /device-socket, destroy the socket (reject the connection)
    socket.destroy();
  }
});

