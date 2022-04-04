const express = require('express')
const resp = require('express/lib/response')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

mongoose.connect('mongodb://localhost/urlShortner')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, resp) => {
    const shortUrls = await ShortUrl.find()
    resp.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, resp) => {
    await ShortUrl.create({ full: req.body.fullUrl })
    resp.redirect('/')
})

app.get('/:shortUrl', async (req, resp) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return resp.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    resp.redirect(shortUrl.full)
})


app.listen(process.env.PORT || 5000)
