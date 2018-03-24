const mongoose = require('mongoose');

var blogPostSchema = mongoose.Schema({
    title: String,
    author: String,
    content: String,
    comments:[
        {comment:String}
    ],
    created: {
        type: Date,
        default: Date.now()
    }

  })

  
module.exports = blogPostSchema;

