const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
var request = require('request');
var router = express.Router();
const mongoose = require('mongoose');
var app = express();
var cors = require('cors')

//Schemas
var messageSchema = require('../schemas/messageSchema');
var userSchema = require('../schemas/userSchema');

var Message = mongoose.model('messages', messageSchema.message);
var User = mongoose.model('user',userSchema.user)

const dbUrl = 'mongodb://nabil:wade5693@ds147668.mlab.com:47668/my-portfolio';
const riotUrl = 'https://na1.api.riotgames.com'
const apiRiotKey = 'api_key=RGAPI-cb67b4ca-c092-473f-b15d-7b6431aa35c9'
var masteryUrl = riotUrl + '/lol/champion-mastery/v3/champion-masteries/by-summoner/80360570/by-champion/103?' + apiRiotKey;
var summonerUrl = riotUrl + '/lol/summoner/v3/summoners/by-name/FoxyDuo?' + apiRiotKey;
var summonerMatchesUrl = riotUrl + '/lol/match/v3/matchlists/by-account/235082437/recent?' + apiRiotKey;


// middle ware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors({origin: true, credentials: true}));

// Mongoose Setup
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
  console.log("Connected To Mongoose")
  
});

router.get('')

// Gets the messages stored
router.get('/messages', (req, res) => {
    db.collection('messages').find().toArray(function (err, result) {
        if (err) throw err;
        res.json(result)
        // console.log(result)
    });
});

router.get('/LoLMastery', (req,res)=>{
    request.get({ url: masteryUrl },   function(error, response, body) {
        if (!error && response.statusCode == 200) { 
            res.send(body); 
           }  
    })
});

router.get('/LoLSummonerInfo', (req,res)=>{
    request.get({url: summonerUrl}, function(error,response,body){
        if(!error && response.statusCode == 200){
            res.send(body);
        }
    })
});


router.get('/LoLSummonerMatches', (req, res)=>{
    request.get({url: summonerMatchesUrl}, function (error, response, body){
        if (!error && response.statusCode == 200){
            res.send(body)
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
});

router.post('/admin/register',(req,res)=>{
    var newUser = new User(req.body)
    newUser.save(function(err,data){
        if (err) throw err;
        console.log("user registered");
        res.status(200).send({
            type: true,
            data: "User Registered Successfully"
        })

    })
})


router.post('/admin/login',(req,res)=>{
    User.findOne({"email": req.body.email}, 'password', function (err,data){
        if (err) throw err;
        console.log(data)
        if (data === null){
            res.status(200).send({
                type:true,
                data:"invalid Email"
            })
        }else{
            if(req.body.password === data.password){
                res.status(200).send({
                    type:true,
                    data:"Successfully Logged In"
                })
            }else{
                res.status(200).send({
                    type:true,
                    data:"invalid Password"
                })
            }
        }
    })
})

module.exports = router;