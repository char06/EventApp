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
        //The line code below creates a random price
        const price = Math.floor(Math.random() * 30) + 10;
        const event = new Event({
            author: '642e2c7821c22b21bccee120',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            //Added unsplash collection to ramdonly show an image associated with the event. 
            image: 'https://source.unsplash.com/collection/7852769', 
            //Also added a lorem ipsum description for the events and the price below. 
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mattis semper ipsum, elementum porta metus aliquam quis. Phasellus ac augue viverra, egestas leo vitae, dapibus est. Praesent auctor magna tellus, vitae ullamcorper velit elementum et. Sed volutpat fringilla nisl. Etiam pulvinar magna in placerat egestas. Vivamus pharetra, quam vel elementum maximus, sapien lacus auctor risus, in maximus tortor eros id ante. Nulla vehicula augue porttitor, tristique magna ut, vulputate orci.',
            price
        })
        await event.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})