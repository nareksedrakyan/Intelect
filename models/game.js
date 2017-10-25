var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var subGameSchema = new Schema({
    user:        { type: Schema.Types.ObjectId, ref:'User' },
    startedAt:   { type: String },
    endedAt:     { type: String }
})

var gameSchema = new Schema({
    subGame:    [ { type: subGameSchema, required: true} ],
    mode:        { type: String, enum:[ 'Categorized','Mixed' ] },
    type:        { type: String, enum:[ 'Single','Duel','Tournament','Playoff' ] },
    createdAt:   { type: String },
    updatedAt:   { type: String },    
    startedAt:   { type: String },
    endedAt:     { type: String }
})

gameSchema.pre('save', function (next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt) {
        this.createdAt = currentDate;
    }
    next();
})

var Game = mongoose.model('Game', sessionSchema);

module.exports = Game;