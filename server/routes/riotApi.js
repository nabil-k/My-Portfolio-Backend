const express = require('express');
var router = express.Router();
var request = require('request');

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