const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp')
}

main()

const db = mongoose.connection
db.on("error", console.error.bind(console, "Mongo Connection Error"))
db.once("open", () => {
    console.log("Database Connected")
})

const sample = array => array[Math.floor(Math.random()*array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for (i=0; i<50; i++) {
        const random1000 = Math.floor(Math.random()*1000)
        const price = Math.floor(Math.random()*20)+10
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(places)} ${sample(descriptors)}`,
            image: 'https://source.unsplash.com/collection/483251',
            price: price,
            description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perferendis, harum. Nihil blanditiis beatae quae esse dolor? Consequuntur incidunt, veniam ab ratione pariatur inventore alias in, debitis deleniti hic deserunt ipsa! Eius obcaecati adipisci vitae ullam fugit quaerat harum voluptas neque asperiores, quis dolores vel nemo blanditiis. Eum corporis voluptas commodi odio expedita earum iste delectus ducimus provident quo. Amet, doloremque!"
        })
        await camp.save()
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close()
    })