const KiteConnect = require('kiteconnect').KiteConnect;
const WebSocket = require('ws');
const express = require('express');
const fs = require('fs');
const token = require('./token.json');
const app = express();
const server = require('http').Server(app);

const wss = new WebSocket.Server({ server });

// KiteConnect API credentials
const apiKey = 'vbwnoztv5asscmta';
const apiSecret = 'yhbz8lin28yznb26jpnlvk5d4kr4rnw6';

// Initialize KiteConnect instance
const kc = new KiteConnect({ api_key: apiKey });

// Redirect URL for authentication
const redirectURL = 'http://localhost:3000';

// Authenticate and get access token
// function authenticateWithKiteConnect(requestToken) {
//   return new Promise((resolve, reject) => {
//     kc.generateSession(requestToken, apiSecret)
//       .then((response) => {
//         // Store the access token in a JSON file
//         const accessToken = response.access_token;
//         const jsonContent = JSON.stringify({ accessToken });
//         require('fs').writeFileSync('token.json', jsonContent, 'utf8');
//         resolve(accessToken);
//       })
//       .catch((err) => reject(err));
//   });
// }

// // WebSocket server connection handler
// wss.on('connection', (ws) => {
//   ws.on('message', (message) => {
//     // Handle message received from the client
//     console.log('Received:', message);
//   });

//   // Handle client connection
//   console.log('Client connected');

//   // Initiate authentication with KiteConnect API
//   kc.getLoginURL((err, loginURL) => {
//     if (err) {
//       console.error('Error generating login URL:', err);
//       return;
//     }
//     console.log('Redirecting client for authentication...');
//     ws.send(loginURL);
//   });

//   // Handle request token received from the client
//   ws.on('request_token', (requestToken) => {
//     console.log('Request token received:', requestToken);

//     authenticateWithKiteConnect(requestToken)
//       .then((accessToken) => {
//         console.log('Authentication successful');
//         ws.send(`Authentication successful. Access token: ${accessToken}`);
//       })
//       .catch((err) => {
//         console.error('Authentication failed:', err);
//         ws.send('Authentication failed.');
//       });
//   });
// });

// // Start the server
// server.listen(3000, () => {
//   console.log('Server started on port 3000');
// });

// Redirect URL for authentication
// const redirectURL = 'http://localhost:3000/callback';

// API endpoint to authorize token and instantiate WebSocket server
app.get('/auth/verify', (req, res) => {
  const requestToken = req.query.request_token;
  console.log('Request token:', requestToken);

  if (!token?.accessToken) {
    kc.generateSession(requestToken, apiSecret)
      .then((response) => {
        const accessToken = response.access_token;
        console.log('Access token:', accessToken);

        // Store the access token in a JSON file
        const jsonContent = JSON.stringify({ accessToken });
        fs.writeFileSync('token.json', jsonContent, 'utf8');

        // Instantiate WebSocket server
        wss.on('connection', (ws) => {
          ws.on('message', (message) => {
            // Handle message received from the client
            console.log('Received:', message);
          });

          // Handle client connection
          console.log('Client connected');

          // Send a response to the client
          ws.send('WebSocket connection established.');
        });

        res.send('Token authorized. WebSocket server instantiated.');
      })
      .catch((err) => {
        console.error('Authorization failed:', err);
        res.status(500).send('Token authorization failed.');
      });
  } else {
    // https://kite.zerodha.com/connect/login?v=3&api_key=vbwnoztv5asscmta
  }
});

// Start the server
server.listen(3000, () => {
  console.log('Server started on port 3000');
});
