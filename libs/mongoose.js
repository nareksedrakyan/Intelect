var mongoose = require('mongoose');
var config = require('./config');
 
 mongoose.Promise = global.Promise;
 mongoose.connect(process.env.OPENSHIFT_MONGODB_DB_URL + 'db'
     //config.get('mongoose:uri'),config.get('mongoose:options')
    );

module.exports.mongoose;