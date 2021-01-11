const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Chat = new Schema({
  name: {
    type: String,
    unique:true,
    required:true
  },
  creatorId: {type: Schema.Types.ObjectId,ref:'User'},
  creator: {type:String,required:true},
  date: {type: Date, default:Date.now},
  messages: [String], //not ids but genIds of messages
  people: [{type: Schema.Types.ObjectId, ref: 'User'}],
  isPrivate: Boolean
});

module.exports = mongoose.model('Chat', Chat);



//console.log(Schema.Types.ObjectId)