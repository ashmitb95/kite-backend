var KiteTicker = require('kiteconnect').KiteTicker
require('dotenv').config()
const token = require('./token.json')
var ticker = new KiteTicker({
    api_key: process?.env?.API_KEY,
    access_token: token?.access_token,
})

// set autoreconnect with 10 maximum reconnections and 5 second interval
ticker.autoReconnect(true, 10, 5)
ticker.connect()
ticker.on('ticks', onTicks)
ticker.on('connect', subscribe)

ticker.on('noreconnect', function () {
    console.log('noreconnect')
})

ticker.on('reconnect', function (reconnect_count, reconnect_interval) {
    console.log(
        'Reconnecting: attempt - ',
        reconnect_count,
        ' interval - ',
        reconnect_interval
    )
})

function onTicks(ticks) {
    console.log('Ticks', ticks)
}

function subscribe() {
    var items = [256265]
    ticker.subscribe(items)
    ticker.setMode(ticker.modeFull, items)
}
