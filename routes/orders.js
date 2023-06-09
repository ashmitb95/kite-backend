const express = require('express')
const KiteConnect = require('kiteconnect').KiteConnect
require('dotenv').config()
const token = require('../token.json')
const app = express()
const kc = new KiteConnect({
    api_key: process.env.API_KEY,
    access_token: token?.access_token,
})

app.get('/', async (req, res) => {
    console.log('Fetching Orders')
    const kc = new KiteConnect({
        api_key: process.env.API_KEY, //'vbwnoztv5asscmta',
        access_token: token?.access_token,
    })

    try {
        const orders = await kc.getOrders()
        console.log(orders)
        res.send(JSON.stringify({ data: orders }))
    } catch (error) {
        console.error('Failed to authorize token:', error)
        res.status(500).json({ error: 'Failed to authorize token' })
    }
})

// Place an order of a particular variety
app.post('/orders/:variety', async (req, res) => {
    try {
        const order = await kc.placeOrder({
            exchange: 'NSE',
            tradingsymbol: req.body.tradingsymbol,
            transaction_type: req.body.transaction_type,
            quantity: req.body.quantity,
            variety: req.params.variety,
            product: req.body.product,
            order_type: req.body.order_type,
            price: req.body.price || null,
            trigger_price: req.body.trigger_price || null,
            validity: req.body.validity || 'DAY',
            squareoff: req.body.squareoff || null,
            stoploss: req.body.stoploss || null,
            trailing_stoploss: req.body.trailing_stoploss || null,
        })
        console.log(order)
        res.send(JSON.stringify({ data: order }))
    } catch (error) {
        console.error('Failed to place order:', error)
        res.status(500).json({ error: 'Failed to place order' })
    }
})

// Modify an open or pending order
app.put('/orders/:variety/:order_id', async (req, res) => {
    try {
        const result = await kc.modifyOrder(
            req.params.order_id,
            {
                quantity: req.body.quantity || null,
                price: req.body.price || null,
                trigger_price: req.body.trigger_price || null,
                validity: req.body.validity || null,
                squareoff: req.body.squareoff || null,
                stoploss: req.body.stoploss || null,
                trailing_stoploss: req.body.trailing_stoploss || null,
            },
            req.params.variety
        )
        console.log(result)
        res.send(JSON.stringify({ data: result }))
    } catch (error) {
        console.error('Failed to modify order:', error)
        res.status(500).json({ error: 'Failed to modify order' })
    }
})

// Cancel an open or pending order
app.delete('/orders/:variety/:order_id', async (req, res) => {
    try {
        const result = await kc.cancelOrder(
            req.params.order_id,
            req.params.variety
        )
        console.log(result)
        res.send(JSON.stringify({ data: result }))
    } catch (error) {
        console.error('Failed to cancel order:', error)
        res.status(500).json({ error: 'Failed to cancel order' })
    }
})

// Retrieve the list of all orders (open and executed) for the day
app.get('/orders', async (req, res) => {
    try {
        const orders = await kc.getOrders()
        console.log(orders)
        res.send(JSON.stringify({ data: orders }))
    } catch (error) {
        console.error('Failed to authorize token:', error)
        res.status(500).json({ error: 'Failed to authorize token' })
    }
})

// Retrieve the history of a given order
app.get('/orders/:order_id', async (req, res) => {
    try {
        const order = await kc.getOrderHistory(req.params.order_id)
        console.log(order)
        res.send(JSON.stringify({ data: order }))
    } catch (error) {
        console.error('Failed to fetch order details:', error)
        res.status(500).json({ error: 'Failed to fetch order details' })
    }
})

module.exports = app
