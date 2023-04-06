//This code was added to create the server with express
const express = require('express'); 
const path = require('path');
const mongoose = require('mongoose'); 
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./helpers/ExpressError');
const methodOverride = require('method-override');
//The following two lines of code will allow us to complete the authentication 
const passport = require('passport'); 
const LocalStrategy = require('passport-local');
const User = require('./models/user'); 
//The following line is to require the new event routes

const userRoutes = require('./routes/users'); 
const eventRoutes = require('./routes/events'); 
const reviewRoutes = require('./models/user');


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

//Explain what EJS mate does...
app.engine('ejs', ejsMate)
//This code will connect the views or pages of the app with our express server. 
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'))

//This will parse the information entered in the form. 
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))


const sessionConfig = {
    secret: 'thisshouldbeasecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

//Added this code to enable authentication

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize()); 
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 

app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/events', eventRoutes)
app.use('/events/:id/reviews', reviewRoutes)

//This code was added to confirm our server is connected with our app. 
app.get('/', (req, res) => {
    res.render('home')
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})

