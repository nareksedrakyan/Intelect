var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GameSchema = new Schema({
    user:        { type: Schema.Types.ObjectId, ref:'User' },
    startedAt:   { type: String },
    endedAt:     { type: String }
})

module.exports = GameSchema;