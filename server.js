const express = require('express');
const WebSocket = require('ws');
const fs = require('fs');
// const ticker = require('./ticker.js');
const token = require('./token.json');
const app = require('./routes');

let accessToken = token?.access_token;

//#region Sockets

const server = app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

const wss = new WebSocket.Server({ server });

const broadcastData = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Handle incoming messages from the client
  ws.on('message', (message) => {
    try {
      console.log('Passing this data: ', message);
      const data = JSON.parse(message);
      broadcastData(data);
    } catch (error) {
      console.error('Invalid JSON data received');
    }
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

//#endregion
