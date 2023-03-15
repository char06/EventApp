//This code was added to create the server with express
const express = require('express'); 
const path = require('path');
const mongoose = require('mongoose'); 
//const methodOverride = require('method-override');
const Event = require('./models/event');

//This is code to connect the dababase with our app. The host number was suggested by mongodb documentation 
mongoose.connect('mongodb://localhost:27017/event-app', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
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

//This code was added to confirm our server is connected with our app. 
app.get('/', (req, res) => {
    res.render('home')
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})

