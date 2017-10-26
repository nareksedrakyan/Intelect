var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const CATEGORIES = ['Other','Sport','Mathematics','History','Geography','Literature','Chemistry','Physics','Art'];

var variantSchema = new Schema({
    description: { type: String, required: true }
})

var questionSchema = new Schema({
    description:    { type: String, required: true, unique: true },
    author:         { type: Schema.Types.ObjectId, required: true , ref: 'User' },
    score:          { type: Number, enum:[100, 150, 200], default: 100 },
    variants:       { type: [variantSchema], required: true},
    answer:         { type: variantSchema, required: true},
    answered:       {
                        total:      { type: Number ,default: 0 },
                        correctly:  { type: Number ,default: 0 },
                    },
    category:       { type: Schema.Types.ObjectId, required: true , ref: 'Category' } ,
    createdAt:      { type: String },
    updatedAt:      { type: String }
})

questionSchema.pre('save', function (next) {

    this.variants.forEach((variant) => {

        if((this.answer._id != variant._id) && (this.answer.description == variant.description)) {
            this.answer._id = variant._id;
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