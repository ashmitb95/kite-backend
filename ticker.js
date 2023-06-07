//#region Ticker

var KiteTicker = require('kiteconnect').KiteTicker;
const token = require('./token.json');
const onTicks = (ticks) => {
  console.log('Ticking data');
  broadcastData(ticks);
};

const doTickerStuff = () => {
  try {
    var ticker = new KiteTicker({
      api_key: 'vbwnoztv5asscmta',
      access_token: token?.access_token,
    });
    ticker.autoReconnect(true, -1, 5);
    // ticker.autoReconnect(true, 10, 5);
    ticker.connect();
    ticker.on('ticks', onTicks);
    ticker.on('connect', () => {
      var items = [738561];
      ticker.subscribe(items);
      ticker.setMode(ticker.modeFull, items);
    });

    // setInterval(onTicks, 2000);

    ticker.on('noreconnect', function () {
      console.log('noreconnect');
    });

    ticker.on('reconnecting', function (reconnect_interval, reconnections) {
      console.log(
        'Reconnecting: attempt - ',
        reconnections,
        ' innterval - ',
        reconnect_interval
      );
    });
  } catch (e) {
    console.log('Error: ', e);
  }
};

module.exports = {
  doTickerStuff,
};

//#endregion Ticker
