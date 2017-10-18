const express   = require('express');
const mongo     = require('mongodb');
var util        = require('util');
var bodyParser  = require('body-parser');
var config      = require('../config');
var log         = require('../libs/log')(module);

var ObjectId = mongo.ObjectID;
const mongoClient    = mongo.MongoClient;
const app            = express();

var url = "mongodb://localhost:27017/db"

// app.set('port',config.get('port'));
// app.set('host',config.get('host'));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoClient.connect(url,function(err, db) {
    if (err) throw err;
    log.info('Database created!');
    // db.createCollection("users",function(err,res) {
    //     if (err) throw err;
    //     console.log("collection created") 
    // })
    // db.close();

    // db.collection('users').remove({}, function(err,result) {
    //     if (err) throw err;
    //     console.log("all documents are removed!") 
    // })

    // db.collection('users').insertMany(allusers,function(err,result) {

    // });
    var userOptions = {password:false};
    
    
    app.listen(config.get('port'), config.get('host'), function() {
        log.info('We are live on ' + config.get('port'));
    });
    
    app.get('/users',function(request,response) {
        db.collection('users').find({},userOptions).toArray(function(err,result){
            if (err) throw err;
            response.status(200).json(result);
        })
    })

    app.get('/users/:id',function(request,response) {
        var query = { _id: ObjectId(request.params.id) };
        db.collection('users').findOne(query,userOptions, function(err,result) {
            if (err) throw err;
            response.status(200).json(result);
        });
    })

    app.post('/register',function(request,response) {
        var user = request.body;
        db.collection('users').findOne({'userName':user.userName},userOptions,function(err,result) {
            if (result) {
               response.status(500).json({"message": "this username is busy"}) 
            } else {
                db.collection('users').insertOne(user,userOptions,function(err,result) {
                    if (err) throw err;
                    delete user.password;
                    response.status(200).json(user);
                })
            }
        })
    })

    app.post('/login',function(request,response) {
        var query = request.body;
        db.collection('users').findOne(query,userOptions,function(err,result) {
            if (err) {
                throw err;
            } else {
                console.log(result);
                if (result) {
                    response.status(200).json(query);                   
                } else {
                    response.status(500).json({"message":"incorrect login or password"});                    
                }
            }
        })
    })

    // questions

    app.get('/questions',function(req,res){
        res.send('all questions');
    })

    app.get('/questions/:page',function(req,res){
        res.send(util.format('questions N%d',req.params.page));
    })

    //next page

    app.post('/next',function(req,res) {
        var user = req.body;
    })
})