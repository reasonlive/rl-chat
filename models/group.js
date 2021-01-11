const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Group = new Schema({
  name: {
    type: String,
    unique: true
  },
  creatorId: {type: Schema.Types.ObjectId, ref: 'User'},
  date: {type: Date, default:Date.now},
  chats: [{type: Schema.Types.ObjectId, ref: 'Chat'}],
  people: [{type: Schema.Types.ObjectId, ref: 'User'}],
  isPrivate: Boolean,
  ban: Boolean
});


module.exports = mongoose.model('Group', Group);

