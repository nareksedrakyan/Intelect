var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    authorId:   { type: Schema.Types.ObjectId, required: true },
    type:       { type: String, required:true },
    subType:    { type: String, default:null } ,
    createdAt:      { type: String },
    updatedAt:      { type: String },
})

categorySchema.pre('save', function (next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt) {
        this.createdAt = currentDate;
    }
    next();
})

var category = mongoose.model('Category', sessionSchema);

module.exports = Session;