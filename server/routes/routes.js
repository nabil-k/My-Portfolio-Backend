const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const jwt = require('jsonwebtoken')
const request = require('request');
var router = express.Router();
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const { IncomingWebhook, WebClient } = require('@slack/client');
var salt = 10;
var validPassword = false;


//Twillio
const accountSid = 'accountSid';
const authToken = 'authToken';
const client = require('twilio')(accountSid, authToken);

//Slack
var generalChannelWebHook = 'generalChannelWebHook'

//Schemas
var messageSchema = require('../schemas/messageSchema');
var userSchema = require('../schemas/userSchema');

var bcryptService = {
    hash: function (req, res, next) {
        bcrypt.hash(req.body.password, salt, function (err, res) {
            if (err) throw err;
            req.body.password = res;
            console.log(res)
            next();
        })
    }
}

var Message = mongoose.model('messages', messageSchema.message);
var User = mongoose.model('user', userSchema)

const dbUrl = 'mongodb://nabil:wade5693@ds147668.mlab.com:47668/my-portfolio';

// FORMAT OF TOKEN
// Authoruzation: Bearer <access_token>

// Vefies Tokens
var userToken;

router.post('/newToken',(req, res) =>{
    userToken = req.body.newToken
    console.log("testy",userToken)
});

// function verifyToken(req, res, next) {
//     // Get auth header value
//     const bearerHeader = userToken
//     // Check if bearer is undefined
//     console.log(bearerHeader)
//     if(bearerHeader !== 'undefined') {
//         console.log("welcome")
//     // Set the token
//     req.token = bearerToken;
//     console.log("reqToken",req.token)
//     // Next middleware
//     next();
//     } else {
//     // Forbidden
//     res.sendStatus(403);
//     }

// }

// Mongoose Setup
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    console.log("Connected To Mongoose")

});

router.get('')

// Gets the messages stored
router.get('/messages',(req, res) => {
    console.log("line 105",userToken)
    jwt.verify(userToken, 'secret_key', (err, authData)=>{
        if(err){
            res.sendStatus(403)
            console.log("?")
            console.log(err)
        }else{
            db.collection('messages').find().toArray(function (err, result) {
                if (err) throw err;
                res.json(result)
                // console.log(result)
            });

        }
    })

});

// Sends new Messages to DB
router.post('/newMessages', (req, res) => {
    var newMessage = Message(req.body);
    newMessage.save()
        .then(item => {
            res.send("new messaged stored")
        })
        .catch(err => {
            res.status(400).send("unable to save message")
        })

    client.messages
        .create({
          body: 
            "name: " + JSON.stringify(req.body.name) + 
            "\n" + JSON.stringify(req.body.message),
          to: '+13239755330',
          from: '+13029900536'
        })
        .then(message => process.stdout.write(message.sid));
    
    portfolioNotification.send(JSON.stringify(req.body), (error, resp) => {
        if (error) {
          return console.error(error);
        }
        console.log('Notification sent');
      });
    

});

// Registers user
router.post('/admin/register', bcryptService.hash, (req, res) => {
    var newUser = new User(req.body)
    newUser.save(function (err, data) {
        if (err) throw err;
        console.log("user registered");
        res.status(200).send({
            type: true,
            data: "User Registered Successfully"
        })

    })
})

// Logs users in
var user;
router.post('/admin/login',(req, res) => {
    User.findOne({ "email": req.body.email }, 'password name', function (err, data) {
        if (err) throw err;
        console.log(data)
        if (data === null) {
            res.status(200).send({
                type: true,
                data: "invalid Email"
            })
        } else {
            bcrypt.compare(req.body.password, data.password, function (err, resp) {
                if (err) throw err;
                user = {name: data.name}
                console.log(user)
                if (resp == true) {
                    const loginNotification = new IncomingWebhook(generalChannelWebHook);
                    const currentTime = new Date().toTimeString();
                    loginNotification.send(`${user.name} logged in at ${currentTime}`, (error, slackRes) => {
                    if (error) {
                        return console.error(error);
                    }
                    console.log('Notification sent');
                    });

                    const token = jwt.sign({user},'secret_key',{ expiresIn: '120s' });
                    console.log("user's token: ",token)

                    res.status(200).send({
                        type: true,
                        data: "Successfully Logged In",
                        token: token
                    })
                } else {
                    res.status(200).send({
                        type: true,
                        data: "invalid Password"
                    })
                }
                console.log("Password:",resp)
            })
        }
    })
})

module.exports = router;