//This code has been added ot start the user authentication with passport 
const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true
  }
});

//This add a field for password to our schema, it will check for usersname and make sure they are unique and some additional methods. 
UserSchema.plugin(passportLocalMongoose); 

module.exports = mongoose.model('User', UserSchema); 