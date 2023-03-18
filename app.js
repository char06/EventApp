//This code was added to create the server with express
const express = require('express'); 
const path = require('path');
const mongoose = require('mongoose'); 
//
const methodOverride = require('method-override');
const Event = require('./models/event');
const res = require('express/lib/response');

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

const app = express();

//This code will connect the views or pages of the app with our express server. 
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'))

//This will parse the information entered in the form. 
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

//This code was added to confirm our server is connected with our app. 
app.get('/', (req, res) => {
    res.render('home')
})
//This is to create the different routes of the app. CRUD operations 

//This code creates the all events route 
//This code is to go to main page of the events. 
//This is the Index or main page 
app.get('/events', async (req, res) => {
    const events = await Event.find({});
    res.render('events/index', { events })
})

//This code is to create a new event
app.get('/events/new', (req, res) => {
    res.render('events/new')
})

//This code is to POST the new Event added to the database. 

app.post('/events', async(req, res) => {
    const event = new Event(req.body.event);
    await event.save();
    res.redirect('/events/${event._id}')
})

//This code shows all the events and when you click on one it shows its ids. The ids were provided by the database. 
app.get('/events/:id', async (req, res) => {
    const event = await Event.findById(req.params.id)
    res.render('events/show', { event })
})

//This code is to edit and Update events
app.get('/events/:id/edit', async(req, res) => {
    const event = await Event.findById(req.params.id)
    res.render('events/edit', { event })

})

//This is to edit and post the change to the database 
app.put('/events/:id', async(req, res) => {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, {...req.body.event}) //This is the method used to update by ID
    res.redirect('/events/${event._id}') 
})

//This is code is to delete an event. 
app.delete('/events/:id', async (req, res) => {
    const {id} = req.params;
    await Event.findByIdAndDelete(id);
    res.redirect('/events');

})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})

