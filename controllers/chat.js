
const Model = require('../models/chat');
const User = require('../models/user');


//@param {String} name  name of chat 
//@param {String} creator User.id
//@param {Boolean} private Chat.isPrivate 
async function addChat(name, creator, private){

	try{
		const count = await Model.countDocuments({name: name});
		if(count > 0)return false;
		const user = await User.findOne({_id: creator});
		if(!user)return new Error('No such User');
		const chat = new Model({name:name,creatorId:user._id,creator:user.name,isPrivate:private});
		user.chats.push(chat._id);
		chat.people.push(user._id);
		const res1 = await user.save();
		const res2 = await chat.save();
		return res2;
	}catch(error){
		return{
			error: true,
			name: error.name,
			message: error.message
		}
	}
}

async function getChat(fields){
	const count = await Model.countDocuments(fields);
	if(count < 1)return null;

	const doc = await Model.findOne(fields)

	return doc;
}


async function removeChat(id){
	const count = await Model.countDocuments({_id:id});
	if(count < 1)return false;

	return await Model.deleteOne({_id:id});
}

async function updateChat(id, values){

	const count = await Model.countDocuments({_id:id});
	if(count === 0)return null;

	const result = await Model.findOneAndUpdate({_id: id}, values, 
	{
		new: true,
	  upsert: true,
	  rawResult: true 
	});

	return result;

}

async function updateAllChats(values){
	

	const result = await Model.updateMany({}, {$set: values}, 
	{
		new: true,
	  upsert: true,
	  rawResult: true 
	});

	return result;
}

async function getAllChats(){
	try{
		const result = await Model.find();
		return result;
	}catch(error){
		return new Error(error.name+"/"+error.message);
	}
	
}

module.exports = {
	addChat,
	getChat,
	removeChat,
	updateChat,
	updateAllChats,
	getAllChats
}



