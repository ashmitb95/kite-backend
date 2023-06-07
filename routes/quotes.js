const express = require('express');
const KiteConnect = require('kiteconnect').KiteConnect;
const token = require('../token.json');
const app = express();
const qs = require('qs');
const { doTickerStuff } = require('../ticker');

//#region Routes
const accessToken = token?.access_token;
console.log('Using access token: ', accessToken);
const kc = new KiteConnect({
  api_key: 'vbwnoztv5asscmta',
  access_token: accessToken,
});

kc.setAccessToken(accessToken);

app.get('/instruments', async (req, res) => {
  const { exchange = 'NSE' } = req.params;
  console.log('Fetching Instruments');

  try {
    const instruments = await kc.getInstruments(exchange);
    console.log(instruments);
    res.send(JSON.stringify({ data: instruments }));
  } catch (error) {
    console.error('Failed to authorize token:', error);
    res.status(500).json({ error: 'Failed to authorize token' });
  }
});

app.get('/ohlc', async (req, res) => {
  const { exchange = 'NSE', instrument_token = 'NIFTY50' } = req.query;
  // const { exchange = 'NSE' } = req.params;
  console.log('Fetching OHLC dataa', req.query);

  try {
    const instruments = await kc.getInstruments('NSE');
    //await kc.getOHLC([`${exchange}:${instrument_token}`]);
    console.log(instruments);
    res.send(JSON.stringify({ data: instruments }));
  } catch (error) {
    console.error('Failed to authorize token:', error);
    res.status(500).json({ error: 'Failed to authorize token' });
  }
});

app.get('/historical-data', async (req, res) => {
  const {
    instrument_token = '256265',
    interval = 'minute',
    from_date = '2023-05-29 09:15:00',
    to_date = '2023-05-30 09:15:00',
    continuous = false,
  } = req?.query || {};
  // const { exchange = 'NSE', instrument_token = 'NIFTY50' } = req.query;
  // const { exchange = 'NSE' } = req.params;
  console.log('Fetching Historical data', {
    instrument_token,
    interval,
    from_date,
    to_date,
    continuous,
  });

  try {
    const historicalData = await kc.getHistoricalData(
      instrument_token,
      interval,
      from_date,
      to_date,
      continuous
    );
    // const historicalData = await kc.getInstruments('NSE');
    console.log(historicalData);
    res.send({ data: historicalData });
  } catch (error) {
    console.error('Error:', JSON.stringify(error));
    res.status(500).json({ error: error });
  }
});

module.exports = app;
