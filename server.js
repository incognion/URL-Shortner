const express = require('express')
// const resp = require('express/lib/response')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT || 1111

const db = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true, useUnifiedTopology: true})
        console.log(`Database Connected: ${conn.connection.host}`)
    } catch (error){
        console.log(error)
        process.exit(1)
    }
}

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


db().then(()=>{
    app.listen(PORT,()=> console.log(`Listening on port ${PORT}`))
})