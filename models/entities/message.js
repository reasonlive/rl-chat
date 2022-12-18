const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Message = new Schema({

  body: {
    type:String,
    validate: {
        validator: function(v) {
          return v.length < 1000 && v.length > 0;
        },

        message: props => `${props.value} length is less then 1 or is more then 1000!`
    },

    required: [true, 'Message required!']
  },

  creatorId: {type: Schema.Types.ObjectId, ref: 'User', required: true},

  chatId: {type: Schema.Types.ObjectId, ref: 'Chat', required: true},

  date: {type: Date, default: Date.now},

  time: {type: String},

});

Message.path('time').default(function(){
	let d = new Date().toString();
	return d.slice(d.indexOf(':')-2, d.indexOf(':')+3);
})

module.exports = mongoose.model('Message', Message);




