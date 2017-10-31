var mongoose = require('mongoose');
var LocationSchema = require('./schemas/locationSchema');
var Schema = mongoose.Schema;
var POSITIONS = ['Beginner','Novice','Advanced','Expert','Master','Genius'];

var RatingSchema = new Schema({
    topic:    { type: Schema.Types.ObjectId , ref: "Topic" },
    rating:   { type: Number, default: 0 }
},{ _id: false, versionKey: false })

var userSchema = new Schema({
    userName:           { type: String, required: true, unique: true },
    email:              { type: String, required: true, unique: true },
    displayName:        { type: String, required: true },
    password:           { type: String, required: true , select: false },
    location:           { type: LocationSchema, required: true },
    totalRating:        { type: Number, default: 0 },
    position:           { type: String, enum: POSITIONS, default: 'Beginner'},
    photoUrl:           { type: String },
    questionIds:        { type: [Schema.Types.ObjectId] , default: [] },
    ratings:            { type: [RatingSchema], default: [] },
    admin:              { type: Boolean, default: false },
    vip:                { type: Boolean, default: false },
    online:             { type: Boolean, default: false },
    lastActive:         { type: String },
    createdAt:          { type: String },
    updatedAt:          { type: String },
    accessToken:        { type: String, default: null }

},{ versionKey: false })

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