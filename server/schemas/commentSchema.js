const mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
    discussionId:String,
    user:{
        type:String,
        default:"Anonymous"
    },
    content:String,
    replies:[
        {
            user:{
                type:String,
                default:"Anonymous"
            },
            content:String
        }
    ],
    created: {
        type: Date,
        default: Date.now()
    }
  })

  
module.exports = commentSchema;

