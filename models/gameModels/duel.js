var mongoose = require('mongoose');
var GameSchema = require('../schemas/gameSchema');

var Schema = mongoose.Schema;

var DuelSchema = new Schema({
    users:        [{ type: Schema.Types.ObjectId, ref:'User' }],
    winner:        { type: Schema.Types.ObjectId, ref:'User' },
    games:        [{ type: GameSchema, required: true }],
    roundCount:    { type: Number , default: 10 },
    questions:    [{ type: Schema.Types.ObjectId, ref:'Question' }],
    createdAt:     { type: String },
    updatedAt:     { type: String },    
    startedAt:     { type: String },
    endedAt:       { type: String }
})

DuelSchema.pre('save', function (next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt) {
        this.createdAt = currentDate;
    }
    next();
})

var Duel = mongoose.model('Duel', DuelSchema);

module.exports = Duel;