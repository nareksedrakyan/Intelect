var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var POSITIONS = ['newbie','amateur','expert','master'];

var userSchema = new Schema({
    userName:           { type: String, required: true, unique: true },
    firstName:          { type: String, required: true },
    lastName:           { type: String, required: true },
    password:           { type: String, required: true , select: false },
    score:              { type: Number, default: 0 },
    position:           { type: String, enum: POSITIONS ,default: 'newbie'},
    photoUrl:           { type: String },
    questionIds:        { type: [Schema.Types.ObjectId] ,default: [] },
    categorizedScores:  { 
                          category: { type: Schema.Types.ObjectId , ref: "Category" },
                          score:    { type: Number, default: 0 }
                        },
    victories:          [{ 
                            contest_id: { type: Schema.Types.ObjectId },
                            type:       { type:String, enum:['duel','tournament','playoff'] },
                            place:      { type:String, enum:['1-st','2-nd','3-th'] },
                        }],
    admin:              { type: Boolean, default: false },
    vip:                { type: Boolean, default: false },
    online:             { type:Boolean, default: false },
    location:           { type: String, required: true },
    createdAt:          { type: String },
    updatedAt:          { type: String },
    accessToken:        { type: String, default: null }
})

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