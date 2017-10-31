var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var topicSchema = new Schema({
    author:         { type: Schema.Types.ObjectId, required: true, ref:'User' },
    type:           { type: String, required: true },
    categoryType:   { type: String, required: true },
    customType:     { type: String, default:null },    
    iconUrl:        { type: String, default: null },
    createdAt:      { type: String },
    updatedAt:      { type: String },
})

topicSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt) {
        this.createdAt = currentDate;
    }
    next();
})

var topic = mongoose.model('Topic', topicSchema);

module.exports = topic;