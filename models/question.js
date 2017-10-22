var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const CATEGORIES = ['Other','Sport','Mathematics','History','Geography','Literature','Chemistry','Physics','Art'];

var questionSchema = new Schema({
    description:    { type: String, required: true, unique: true },
    authorId:       { type: Schema.Types.ObjectId, default: null },
    score:          { type: Number, default: 50 },
    variants:       [{
                        id:          { type: Schema.Types.ObjectId },
                        description: { type: String, required: true }
                    }],
    answer:         {
                        id:          { type: Schema.Types.ObjectId },
                        description: { type: String, required: true }
                    },
    answered:       {
                        total:      { type: Number ,default: 0 },
                        correctly:  { type: Number ,default: 0 },
                    },
    category:       {
                        type:       { type: String, enum: CATEGORIES, required:true },
                        subType:    { type: String, default:null }  // category type creted by user 
                    } ,
    createdAt:      { type: String },
    updatedAt:      { type: String },
})

questionSchema.pre('save', function (next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt) {
        this.createdAt = currentDate;
    }
    next();
})

var Question = mongoose.model('Question', questionSchema);
module.exports = Question;