const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const jwt = require('jsonwebtoken')
const request = require('request');
var router = express.Router();
const mongoose = require('mongoose');
var app = express();
var cors = require('cors');
var bcrypt = require('bcrypt');


var salt = 10;

var validPassword = false;


//Schemas
var messageSchema = require('../schemas/messageSchema');
var userSchema = require('../schemas/userSchema');





// var xssService = {
//     sanitize: function (req, res, next) {
//         var data = req.body
//         for (var key in data) {
//             if (data.hasOwnProperty(key)) {
//                 data[key] = xss(data[key]);
//                 console.log(data[key]);
//             }

//         }
//         next();
//     }

// }

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
const riotUrl = 'https://na1.api.riotgames.com'
const apiRiotKey = 'api_key=RGAPI-cb67b4ca-c092-473f-b15d-7b6431aa35c9'
var masteryUrl = riotUrl + '/lol/champion-mastery/v3/champion-masteries/by-summoner/80360570/by-champion/103?' + apiRiotKey;
var summonerUrl = riotUrl + '/lol/summoner/v3/summoners/by-name/FoxyDuo?' + apiRiotKey;
var summonerMatchesUrl = riotUrl + '/lol/match/v3/matchlists/by-account/235082437/recent?' + apiRiotKey;


// middle ware
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
// app.use(cors({origin: true, credentials: true}));

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

router.get('/LoLMastery', (req, res) => {
    request.get({ url: masteryUrl }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        }
    })
});

router.get('/LoLSummonerInfo', (req, res) => {
    request.get({ url: summonerUrl }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        }
    })
});


router.get('/LoLSummonerMatches', (req, res) => {
    request.get({ url: summonerMatchesUrl }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
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

                user = {name: req.body.name}
    
                if (resp == true) {

                    const token = jwt.sign({user},'secret_key');

                    console.log("user's token: ",token)


                    res.status(200).send({
                        type: true,
                        data: "Successfully Logged In"
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