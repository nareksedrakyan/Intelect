var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var QuizSchema = new Schema({
    user:        { type: Schema.Types.ObjectId, ref:'User' },
    mode:        { type: String, enum:[ newFunction(),'Mixed' ] },
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

var Quiz = mongoose.model('Quiz', QuizSchema);

module.exports = Game;
function newFunction() {
    return 'Categorized';
}
