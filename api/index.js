var express = require('express');
var util = require('util');
var bodyParser = require('body-parser');
var config = require('../libs/config');
var mongoose = require('../libs/mongoose');

var User = require('../models/user');
var Question = require('../models/question');

var router = express.Router(); 
var app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', router);

app.listen(config.get('port'), config.get('host'), function() {
    console.log('We are live on ' + config.get('port'));
});

router.get('/', function(request, response) {
    response.status(200).json({ message: 'hooray! welcome to our api!' });   
});


router.route('/signup')
    .post(function(request, response) {
        var user = new User(request.body);
        user.save(function(err) {
            if (err) {
                response.status(404).json(err.message);
            }
            response.status(200).json(user);
        })
    })

router.route('/signin')
    .post(function(request, response) {
        
    })

router.route('/users')
    .get(function(request, response) {
        User.find(function(err, users) {
           if (err) {
            response.status(404).json(err);
           } 
           response.status(200).json(users);
        })
    })

router.route('/users/:id')
    .get(function(request, response) {
        User.findById(request.params.id, function(err, user) {
            if (err) {
                response.status(404).json(error);
            }
            response.status(200).json(user);
        })
    })

    .put(function(request, response) {
        User.findByIdAndUpdate(request.params.id, request.body, function(err, user) {
            if (err) {
                response.status(404).json(error);
            }
            response.status(200).json(user);
        })
    })

    .delete(function(request, response) {
        User.findByIdAndRemove(request.params.id, function(err) {
            if (err) {
                response.status(404).json(err);
            }
            response.status(200).json({ message: 'user successfully deleted' });
        })
    })
    
    
router.route('/create_question')
    .post(function(request, response) {

    })

router.route('/questions')
    .get(function(request, response) {
        Question.find(function(err, questions) {
           if (err) {
            response.status(404).json(error);
           } 
           response.status(200).json(questions);
        })
    })

router.route('/questions/:id')
    .get(function(request, response) {
        Question.findById(request.params.id, function(err, question) {
            if (err) {
                response.status(404).json(error);
            }
            response.status(200).json(question);
        })
    })

    .put(function(request, response) {
        Question.findByIdAndUpdate(request.params.id, request.body, function(err, question) {
            if (err) {
                response.status(404).json(error);
            }
            response.status(200).json(question);
        })
    })

    .delete(function(request, response) {
        Question.findByIdAndRemove(request.params.id, function(err) {
            if (err) {
                response.status(404).json(err);
            }
            response.status(200).json({ message: 'question successfully deleted' });
        })
    })