const express = require('express');
var router = express.Router();
var request = require('request');

const riotUrl = 'https://na1.api.riotgames.com'
const apiRiotKey = 'api_key=RGAPI-cb67b4ca-c092-473f-b15d-7b6431aa35c9'
var masteryUrl = riotUrl + '/lol/champion-mastery/v3/champion-masteries/by-summoner/80360570/by-champion/103?' + apiRiotKey;
var summonerUrl = riotUrl + '/lol/summoner/v3/summoners/by-name/FoxyDuo?' + apiRiotKey;
var summonerMatchesUrl = riotUrl + '/lol/match/v3/matchlists/by-account/235082437/recent?' + apiRiotKey;


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

module.exports = router;