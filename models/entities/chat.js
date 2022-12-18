const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Chat = new Schema({
  name: {type: String, required: true},

  uniqueId: {type: String, required: true, unique: true},

  creatorId: {type: Schema.Types.ObjectId, ref:'User', required: true},
  
  date: {type: Date, default: Date.now},
  
  messages: [{type: Schema.Types.ObjectId, ref: 'Message'}],
  
  users: [{type: Schema.Types.ObjectId, ref: 'User'}],
  
  isPrivate: {type: Boolean, default: false}

});

module.exports = mongoose.model('Chat', Chat);