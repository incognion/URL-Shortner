const express = require('express')
// const resp = require('express/lib/response')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()
const port = process.env.PORT || 1111

mongoose.connect('mongodb://127.0.0.1/urlShortner', {useNewUrlParser: true, useUnifiedTopology: true})

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


app.listen(port, ()=>{
    console.log(`this app is listening at port: ${port}`)
})