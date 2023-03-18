//This file was created to seed the database with fake data 
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

const mongoose = require('mongoose'); 
//const methodOverride = require('method-override');
const Event = require('../models/event');

//This is code to connect the dababase with our app. The host number was suggested by mongodb documentation 
mongoose.connect('mongodb://localhost:27017/event-app', {
   // useNewUrlParser: true, Remove this based on mongo db community forums 
   // useCreateIndex: true,
   // useUnifiedTopology: true
}); 

//This code was created to confirm the db is connnected if not, throw an error. 
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//This code will return a random element from the seedhelpers dataset, so we will loop over the array

const sample = array => array[Math.floor(Math.random() * array.length)];


//This code was create to create the new fake events and loop through them to create ramdom locations. 

const seedDB = async () => {
    await Event.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const event = new Event({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await event.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})