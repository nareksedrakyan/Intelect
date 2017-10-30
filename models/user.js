var mongoose = require('mongoose');
var LocationSchema = require('./schemas/locationSchema');
var Schema = mongoose.Schema;
var POSITIONS = ['Beginner','Novice','Advanced','Expert','Master','Genius'];

var userSchema = new Schema({
    userName:           { type: String, required: true, unique: true },
    email:              { type: String, required: true, unique: true },
    displayName:        { type: String,required: true },
    lastName:           { type: String },
    password:           { type: String, required: true , select: false },
    location:           { type: LocationSchema, required: true },
    score:              { type: Number, default: 0 },
    position:           { type: String, enum: POSITIONS ,default: 'Beginner'},
    photoUrl:           { type: String },
    questionIds:        { type: [Schema.Types.ObjectId] ,default: [] },
    categorizedScores:  [{ 
                          category: { type: Schema.Types.ObjectId , ref: "Category" },
                          score:    { type: Number, default: 0 }
                        }],
    admin:              { type: Boolean, default: false },
    vip:                { type: Boolean, default: false },
    online:             { type: Boolean, default: false },
    location:           { type: String },
    createdAt:          { type: String },
    updatedAt:          { type: String },
    accessToken:        { type: String, default: null }
})

userSchema.pre('save', function (next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt) {
        this.createdAt = currentDate;
    }
    next();
})

var User = mongoose.model('User', userSchema);

module.exports = User;