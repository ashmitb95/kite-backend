const express = require('express');
const KiteConnect = require('kiteconnect').KiteConnect;
const token = require('../token.json');
const app = express();
const qs = require('qs');
const { doTickerStuff } = require('../ticker');

//#region Routes
const accessToken = token?.access_token;
console.log('Using access token: ', accessToken);

app.get('/', async (req, res) => {
  console.log('Fetching Orders');
  const kc = new KiteConnect({
    api_key: 'vbwnoztv5asscmta',
    access_token: token?.access_token,
  });

  try {
    const orders = await kc.getOrders();
    console.log(orders);
    res.send(JSON.stringify({ data: orders }));
  } catch (error) {
    console.error('Failed to authorize token:', error);
    res.status(500).json({ error: 'Failed to authorize token' });
  }
});

module.exports = app;
