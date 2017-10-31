var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LocationSchema = new Schema({
    latitude:    { type: Number, required: true },
    longitude:   { type: Number, required: true },
    country:     { type: String ,default: null },
    countryCode: { type: String ,default: null },
    city:        { type: String ,default: null },
    zipcode:     { type: String ,default: null }
},{ _id: false })

module.exports = LocationSchema;