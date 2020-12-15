const axios = require('axios')
const cron = require('node-cron');
const sourcesFile = require('./sources.json')
let Parser = require('rss-parser');
const express = require('express')
require("dotenv").config();
const parser = new Parser();
const app = express()

let actualData = [{
    "title": "item.title",
    "date": "item.pubDate",
    "content": "item.contentSnippet"
}]
let actualDate = new Date()

let yearMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

cron.schedule('*/5 * * * *', () => {
    console.log('running a task every 30 second')
    actualData = []
    sourcesFile.forEach(async (elem) => {
        try {
            let feed = await parser.parseURL(elem.url);

            feed.items.forEach(item => {
                if ((item.pubDate.split(/ |:/)[3] === actualDate.getFullYear().toString())
                    && (item.pubDate.split(/ |:/)[2] === yearMonth[actualDate.getMonth()])
                    && (item.pubDate.split(/ |:/)[1] === actualDate.getDate().toString())) {
                    actualData.push({
                        "title": item.title,
                        "date": item.pubDate,
                        "content": item.contentSnippet
                    })
                }
            })
        } catch (e) {
            console.log(e)
        }
    })
})

app.get('/webhook', (req, res) => {
    res.json(actualData)
})

app.listen(process.env.PORT, () => console.log(`App running on ${process.env.PORT}`))