const express = require('express')
const KiteConnect = require('kiteconnect').KiteConnect
const token = require('../token.json')
const app = express()
const qs = require('qs')
const { doTickerStuff } = require('../ticker')
require('dotenv').config()
//#region Routes
const accessToken = token?.access_token
console.log('Using access token: ', accessToken)

app.get('/positions', async (req, res) => {
    console.log('Fetching Positions')
    const kc = new KiteConnect({
        api_key: process.env.API_KEY, //'vbwnoztv5asscmta',
        access_token: accessToken,
    })

    try {
        const orders = await kc.getPositions()
        console.log(orders)
        res.send(JSON.stringify({ data: orders }))
    } catch (error) {
        console.error('Failed to authorize token:', error)
        res.status(500).json({ error: 'Failed to authorize token' })
    }
})

app.get('/profile', async (req, res) => {
    console.log('Fetching Profile')
    const kc = new KiteConnect({
        api_key: process.env.API_KEY,
        access_token: accessToken,
    })

    try {
        const orders = await kc.getProfile()
        console.log(orders)
        res.send(JSON.stringify({ data: orders }))
    } catch (error) {
        console.error('Failed to authorize token:', error)
        res.status(500).json({ error: 'Failed to authorize token' })
    }
})

module.exports = app
