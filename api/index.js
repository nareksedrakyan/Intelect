var express = require('express');
var util = require('util');
var bodyParser = require('body-parser');
var config = require('../libs/config');
var mongoose = require('../libs/mongoose');
var path = require('path');
var User = require('../models/user');
var Question = require('../models/question');
var Topic = require('../models/topic');
var Quiz = require('../models/gameModels/quiz');


var NodeGeocoder = require('node-geocoder');
var options = {
 provider: 'google'
};
var geocoder = NodeGeocoder(options);

var router = express.Router(); 
var app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', router);
app.use('/countries', express.static(path.join(__dirname,'/../public/img')));
var port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log('We are live on ' + config.get('port'));
});

router.get('/', function(request, response) {
    response.json({ message: 'hooray! welcome toj our api!' });   
});
// USERS
router.route('/users/signup')

    .post(function(request, response) {
        var user = new User(request.body);
        if (!validateEmail(user.email)) {
            var errMessage = 'This email address is not valid';
            return response.status(404).json(errMessage)
        }
        if (user.location) {
            geocoder.reverse({ lat:user.location.latitude, lon:user.location.longitude }, function(err, res) {
                if (err) console.log(err); 
                user.location.country = res[0].country;
                user.location.countryCode = res[0].countryCode;
                user.location.city = res[0].city;      
                user.location.zipcode = res[0].zipcode;
                sendRegisteredUser(user,response);
              });
        } else {
            sendRegisteredUser(user,response);
        }
       
    })

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function sendRegisteredUser(user,response) {
    user.save(function(error) {
        if (error) {
            var errMessage = error.message;
            if (error.errors.userName && error.errors.userName.kind == 'unique') {
                errMessage = 'An user with this username already exist';
            } else if (error.errors.email && error.errors.email.kind == 'unique') {
                errMessage = 'An user with this email already exist';
            };
           return response.status(404).json(errMessage);
        }
        response.json(user);
    })
}

router.route('/users/signin')
    .post(function(request, response) {
        var user = User.findOne({ userName:request.body.userName, password:request.body.password }, function(err, user) {
            if (err) {
                return response.status(404).json(err.message);
            } else if (!user) {
                var errMessage = 'Username or Password incorrect'
                return response.status(404).json(errMessage);
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
        User.findByIdAndUpdate(request.params.id, request.body,{ new: true }, function(err, user) {
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
 
// QUESTIONS
router.route('/create_question')
    .post(function(request, response) {
        var question = new Question(request.body);
        question.save(function(err) {
            if (err) {
               return response.status(404).json(err.message);
            }
            response.json(question);
        })

        User.findById(question.authorId, function(findError, author) {
            if (findError) {
                return response.status(404).json(findError.message);
            }
            author.questionIds.push(question._id)
            author.save(function(saveError) {
                if (saveError) {
                    return response.status(404).json(saveError.message);
                }
            })
        })
    })

router.route('/questions')
    .get(function(request, response) {
        Question.find(function(err, questions) {
           if (err) {
            return response.status(404).json(err.message);
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

// GET NEXT QUESTION   
router.route('/next_question')
    .post(function(request, response) {

        var excludedQuestionIds = request.body.excludedQuestionIds;
        if (!excludedQuestionIds) {
            excludedQuestionIds = [];
        }

        var userId = request.body.userId;

        var questionId = request.body.questionId;
        var answerResult = request.body.result;
    
        User.findById(userId, function(error, user) {
            if (error) {
                return response.status(404).json(error);
            }
            Question.findById(questionId, function(questionFindError, question) {
                if (questionFindError) {
                    return response.status(404).json(questionFindError);
                }
                
                question.answered.total++;
                question.answered.correctly += answerResult ? 1 : 0;
                question.save((function(questionSaveError) {
                    if (questionSaveError) {
                       return response.status(404).json(questionSaveError.message);
                    }
                }))

                user.score += answerResult ? question.score : 0;
                user.save((function(userSaveError) {
                    if (userSaveError) {
                       return response.status(404).json(userSaveError.message);
                    }
                }))
            })
        })

        Question.find({ _id: { $nin :excludedQuestionIds } }, function(questionsFindError, questions) {
            if (questionsFindError) {
                return response.status(404).json(questionsFindError.message);
            } else if (questions.count == 0) {
                return response.json({ message: 'questions are over' });
            }
            var randomIndex = getRandomInt(0, questions.length - 1);
            var randomQuestion = questions[randomIndex];
            response.json(randomQuestion);
        })
    })
    
    router.route('/first_question')
    .post(function(request, response) {
        var excludedQuestionIds = request.body.excludedQuestionIds;
        if (!excludedQuestionIds) {
            excludedQuestionIds = [];
        }
        
        Question.find({ _id: { $nin :excludedQuestionIds } }, function(questionsFindError, questions) {
            if (questionsFindError) {
                return response.status(404).json(questionsFindError.message);
            } else if (questions.count == 0) {
                return response.json({ message: 'questions are over' });
            }
            var randomIndex = getRandomInt(0, questions.length - 1);
            var randomQuestion = questions[randomIndex];
            response.json(randomQuestion);
        })
    })

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}








// USERS
router.route('/quiz_create')
.post(function(request, response) {
    var quiz = new Quiz(request.body);
    quiz.save(function(err) {
        if (err) {
           return response.status(404).json(err.message);
        }
        
        if (quiz.mode == 'Categorized') {
            Topic.find().populate('author'). exec(function (err, topics) {
                if (err) {
                 return response.status(404).json(err);
                } 
                response.json({ "quiz": quiz,"categories": topics});
             })
        } else {
            response.json(quiz);
        }
    })
})

router.route('/quiz_start')
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