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
    response.json({ message: 'hooray! welcome to our api!' });   
});

// Users

router.route('/signup')
    .post(function(request, response) {
        var user = new User(request.body);
        user.save(function(err) {
            if (err) {
               return response.status(404).json(err.message);
            }
            response.json(user);
        })
    })

router.route('/signin')
    .post(function(request, response) {
        var user = User.findOne({ userName:request.body.userName, password:request.body.password }, function(err, user) {
            if (err) {
                return response.status(404).json(err.message);
            }  
            response.json(user);
        })
    })

router.route('/users')
    .get(function(request, response) {
        User.find(function(err, users) {
           if (err) {
            return response.status(404).json(err);
           } 
           response.json(users);
        })
    })

router.route('/users/:id')
    .get(function(request, response) {
        User.findById(request.params.id, function(err, user) {
            if (err) {
                return response.status(404).json(error);
            }
            response.json(user);
        })
    })

    .put(function(request, response) {
        User.findByIdAndUpdate(request.params.id, request.body,{new: true}, function(err, user) {
            if (err) {
                return response.status(404).json(error);
            }
            response.json(user);
        })
    })

    .delete(function(request, response) {
        User.findByIdAndRemove(request.params.id, function(err) {
            if (err) {
                return response.status(404).json(err);
            } 
            response.json({ message: 'user successfully deleted' });
        })
    })
 
// questions
    
router.route('/create_question')
    .post(function(request, response) {
        var question = new Question(request.body);
        question.save(function(err) {
            if (err) {
               return response.status(404).json(err.message);
            }
            response.json(question);
        })
    })

router.route('/questions')
    .get(function(request, response) {
        Question.find(function(err, questions) {
           if (err) {
            return response.status(404).json(error);
           } 
           response.json(questions);
        })
    })

router.route('/questions/:id')
    .get(function(request, response) {
        Question.findById(request.params.id, function(err, question) {
            if (err) {
                return response.status(404).json(error);
            }
            response.json(question);
        })
    })

    .put(function(request, response) {
        Question.findByIdAndUpdate(request.params.id, request.body, function(err, question) {
            if (err) {
                return response.status(404).json(error);
            }
            response.json(question);
        })
    })

    .delete(function(request, response) {
        Question.findByIdAndRemove(request.params.id, function(err) {
            if (err) {
                return response.status(404).json(err);
            }
            response.json({ message: 'question successfully deleted' });
        })
    })