const express = require('express')
const path = require('path')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const ExpressError = require('./utils/ExpressError')

const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')

const app = express()

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp')
}

main()

const db = mongoose.connection
db.on("error", console.error.bind(console, "Mongo Connection Error"))
db.once("open", () => {
    console.log("Database Connected")
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

app.get('/', (req, res) => {
    res.render('test')
})

app.all('*', (req, res) => {
    throw new ExpressError("Not Found", 404)
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Oh no! Something went wrong!!'
    res.status(statusCode).render('error', {err})
})

app.listen(3000, () => {
    console.log('Listening on port 3000')
})