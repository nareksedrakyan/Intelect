var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userName:       { type: String, required: true, unique: true },
    firstName:      { type: String, required: true },
    lastName:       { type: String, required: true },
    password:       { type: String, required: true },
    score:          { type: Number, default: 0 },
    photoUrl:       { type: String },
    questionIds:    { type: Array[Schema.Types.ObjectId] },
    admin:          { type: Boolean, default: false },
    vip:            { type: Boolean, default: false },
    location:       { type: String, required: true },
    createdAt:      { type: String },
    updatedAt:      { type: String },
    accessToken:    { type: String, default: null, unique: true }
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