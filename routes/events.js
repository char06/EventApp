const express = require('express');
const router = express.Router();
const catchAsync = require('../helpers/catchAsync');
const { eventSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');

const ExpressError = require('../helpers/ExpressError');
const Event = require('../models/event');

// Validate event
const validateEvent = (req, res, next) => {
    const { error } = eventSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
//This is to create the different routes of the app. CRUD operations 
//This code creates the all events route 
//This code is to go to main page of the events. 
//This is the Index or main page 
router.get('/', catchAsync(async (req, res) => {
    const events = await Event.find({});
    res.render('events/index', { events })
}));

//This code is to create a new event
router.get('/new', isLoggedIn, (req, res) => {
    res.render('events/new');
})

//This code is to POST the new Event added to the database. 

router.post('/', isLoggedIn, validateEvent, catchAsync(async (req, res, next) => {
    const event = new Event(req.body.event);
    await event.save();
    req.flash('success', 'Successfully made a new Event!');
    res.redirect(`/events/${event._id}`)
}))

//This code shows all the events and when you click on one it shows its ids. The ids were provided by the database. 
router.get('/:id', catchAsync(async (req, res,) => {
    const event = await Event.findById(req.params.id).populate('reviews').populate('author');
    if (!event) {
        req.flash('error', 'Cannot find that Event!');
        return res.redirect('/events');
    }
    res.render('events/show', { event });
}));

//This code is to edit and Update events
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const event = await Event.findById(req.params.id)
    if (!event) {
        req.flash('error', 'Cannot find that event!');
        return res.redirect('/events');
    }
    res.render('events/edit', { event });
}))

//This is to edit and post the change to the database 
router.put('/:id', isLoggedIn, validateEvent, catchAsync(async (req, res) => {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, { ...req.body.event });
    req.flash('success', 'Successfully updated event!');
    res.redirect(`/events/${event._id}`)
}));

//This is code is to delete an event. 
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted event')
    res.redirect('/events');
}));

module.exports = router;