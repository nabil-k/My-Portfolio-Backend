const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: String,
    email:String,
    password:String,
    pic:{
        type: String,
        default: './assets/me.png'
    },
    created: {
        type: Date,
        default: Date.now()
    },
    modified: {
        type: Date,
        default: Date.now()
    }
  })


module.exports = userSchema;