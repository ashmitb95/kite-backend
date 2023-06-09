const express = require('express')
const KiteConnect = require('kiteconnect').KiteConnect
const token = require('../token.json')
const fs = require('fs')
const app = express()
require('dotenv').config()
const { doTickerStuff } = require('../ticker')

//#region Routes
const kc = new KiteConnect({ api_key: 'vbwnoztv5asscmta' })

app.get('/verify', async (req, res) => {
    const { request_token } = req.query
    console.log(
        'Using request token to generate access token. Request token: ',
        process.env.API_SECRET
    )

    try {
        const response = await kc.generateSession(
            request_token,
            process.env.API_SECRET //'pk84rpqwcxj8zk8j827aqts51rd9jqoq'
        )

        const newAccessToken = response.access_token
        const expiresIn = response.expires_in

        const newToken = {
            access_token: newAccessToken,
            expires_in: expiresIn,
        }

        // Save token to file
        fs.writeFileSync('token.json', JSON.stringify(newToken))

        // doTickerStuff();
        res.send('Access token generated and saved successfully')
    } catch (error) {
        console.error('Could not fetch token:', error)
        res.status(500).json({ error: 'Failed to authorize token' })
    }
})

app.get('/beat', async (req, res) => {
    console.log('Running check auth')
    try {
        res.header('Access-Control-Allow-Origin', '*')
        const hasToken = Boolean(token?.access_token)
        console.log('Trying to do ticker stuff')
        if (hasToken) {
            doTickerStuff()
        }
        res.send({
            hasToken: hasToken,
        })
    } catch (error) {
        console.error('Something went wrong:', error)
        res.status(500).json({ error: 'Failed to authorize token' })
    }
})

module.exports = app
