//This code was added to connect and add the mongo database to our event app
const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

//An Object Data Modeling (ODM) library for MongoDB and Node.js is called Mongoose. It handles data associations, offers schema validation, and translates between objects created in code and how MongoDB represents those same items.

//The document's structure, default values, validators, etc. are all specified in a Mongoose schema.

const EventSchema  = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    //The following line of code is to add basic authorization about who can add or remove reviews or events
    author:{
        type: Schema.Types.ObjectId, 
        ref: 'User'

    }, 
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

EventSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Event', EventSchema); 