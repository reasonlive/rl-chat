const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cryptoJS = require('crypto-js');

const User = new Schema();
//const id = mongoose.Types.ObjectId();
const salt = require('../lib/config').key;

User.add({
  //id: {type: mongoose.Types.ObjectId, default: id, index:true},
  name: {
    type: String,
    index: true,
    unique: true,
  },
  age: Number,
  country: {type: String, default: 'Unknown'},
  password: {type: String, required: true},
  email: {
    type: String,
    required: true,
    unique:true,
    match: /[a-zA-Z0-9\-_]{3,15}@[a-z]{3,12}\.[a-z]{2,6}/,
  },
  registered: {type: Date, default: Date.now},
  //messages: [String],
  status: {type:String,default:'newbie'},
  estimate: {type:Number,default:0},
  tags: [String],
  chats: [{type: Schema.Types.ObjectId ,ref:'Chat'}], 
  groups: [{type: Schema.Types.ObjectId,ref:"Group"}], 
  people: [{type: Schema.Types.ObjectId,ref:"User"}],
  ban: {
  	banned: {type:Boolean, default: false},
  	expires: {type: Number, default: 0},
    dateOfApply: {type: Date},
  	forever: {type: Boolean, default: 0}
  },
  avatar: {type:String, default: 'avatar.png'},
  admin: {type:Boolean, default: false},
  online: {type:Boolean, default: false},
  lastIpLog: {
    ip: String,
    date: Date
  }
  
});


User.methods.hashPassword = function(password) {
  
  this.password = cryptoJS.AES.encrypt(password, salt).toString();
  
};

User.methods.checkPassword = function(password){

  let decrypt = cryptoJS.AES.decrypt(this.password, salt);
  let original = decrypt.toString(cryptoJS.enc.Utf8);

  return original === password;
}

User.methods.checkBan = function(){
   
  if(!this.ban.banned || this.ban.forever)return;
  else{
      let now  = Date.now();
      let start = Date.parse(this.ban.dateOfApply);
      if((now - start) > this.ban.expires){
        this.ban.expires = 0;
        this.ban.dateOfApply = 0;
        this.ban.banned = false;
      }

  }
}

User.virtual('pass').set(function(password){this.hashPassword(password)});




module.exports = mongoose.model('User', User);






