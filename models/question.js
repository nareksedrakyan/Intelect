var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const CATEGORIES = ['Other','Sport','Mathematics','History','Geography','Literature','Chemistry','Physics','Art'];

var variantSchema = new Schema({
    id:          { type: Schema.Types.ObjectId },
    description: { type: String, required: true },
    _id: false
})

var questionSchema = new Schema({
    description:    { type: String, required: true, unique: true },
    authorId:       { type: Schema.Types.ObjectId, required: true },
    score:          { type: Number, enum:[100, 150, 200], default: 100 },
    variants:       { type: [variantSchema], required: true},
    answer:         { type: variantSchema, required: true},
    answered:       {
                        total:      { type: Number ,default: 0 },
                        correctly:  { type: Number ,default: 0 },
                    },
    category:       {
                        type:       { type: String, enum: CATEGORIES, required:true },
                        subType:    { type: String, default:null }  // category type creted by user 
                    } ,
    createdAt:      { type: String },
    updatedAt:      { type: String }
})

questionSchema.pre('save', function (next) {

    this.variants.forEach((variant) => {
        if (!variant.id) {
            variant.id = mongoose.Types.ObjectId();
        }
        if((!this.answer.id) && (this.answer.description == variant.description)) {
            this.answer.id = variant.id;
        }
      });
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt) {
        this.createdAt = currentDate;
    }
    next();
})

var Question = mongoose.model('Question', questionSchema);
module.exports = Question;