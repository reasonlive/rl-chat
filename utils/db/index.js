const mongoose = require('mongoose');
const cfg = require('../../config');

mongoose.connect('mongodb://'+cfg.host+':'+cfg.port.database+'/'+cfg.dbname, {
	  useNewUrlParser: true,
	  useUnifiedTopology: true,
	  useFindAndModify: false,
	  useCreateIndex: true,
	 // serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  		//socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
	});


mongoose.connection.on('error', err => {
  console.log(err);
});


module.exports = mongoose;

