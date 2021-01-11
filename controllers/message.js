const Model = require('../models/message');
const User = require('../models/user');
const Chat = require('../models/chat');


async function addMessage(body,userId,chatId,gen){
	try{

		

		const messageModel = new Model({
			body:body,
			creatorId:userId,
			chatId:chatId,
			genId: gen
		});
		const res = await messageModel.save();
		return res;

	}catch(error){
		return{
			error: true,
			name: error.name,
			message: error.message
		}
	}
}

async function removeMessage(gen){
	try{
		const count = await Model.countDocuments({genId:gen});
		if(count < 1)return false;
		
		let res = await Model.deleteOne({genId:gen});
		return !!res.ok;

	}catch(error){
		return{
			error: true,
			name: error.name,
			message: error.message
		}
	}
	return false;
	
}

async function updateMessage(gen,body){
	
	try{
		const count = await Model.countDocuments({genId: gen});
		if(count === 0)return null;

		let result = await Model.findOneAndUpdate({genId: gen}, {body:body}, 
		{
			new: true,
		  upsert: true,
		  rawResult: true 
		});
		return result;
	}catch(error){
		return{
			error: true,
			name: error.name,
			message: error.message
		}
	}
	
}

async function getMessage(id){
	
	try{
		const count = await Model.countDocuments({genId:id});
		if(count < 1)return null;

		let doc = await Model.findOne({genId:id});
		return doc;
	}catch(error){
		return{
			error: true,
			name: error.name,
			message: error.message
		}
	}
	

	
}

async function getMessageByQuery(query){
	try{
		const count = await Model.countDocuments(query);
		if(count < 1)return null;

		let doc = await Model.findOne(query);
		return doc;
	}catch(error){
		return {
			error: true,
			name: error.name,
			message: error.message
		}
	}
}


///////it may delete either messages from base or messages from both base and chats

async function removeAllMessages(chatId){
	

	const count = await Chat.countDocuments({_id:chatId});
	if(count < 1)return null;
	try{
		let chat = await Chat.findById(chatId);

		for(let msg of chat.messages){
			try{

				await Model.deleteOne({_id:msg._id});

			}catch(e){
				console.log(e);
				continue;
			}
		
		}
		let deleted = await Chat.updateOne({_id: chatId}, {messages: []});
		if(deleted.ok)return true;
	}catch(e){
		return {
			error:true,
			name:e.name,
			message:e.message
		}
	}
	

	
}



module.exports = {
	addMessage,
	getMessage,
	getMessageByQuery,
	removeMessage,
	updateMessage,
	removeAllMessages,
}



////////////////////TEST OF ALL FUNCTIONS AT A TIME////////////////////////////////

/*const mongoose = require('../custom/db');

const userMod = require('./user');
const chatMod = require('./chat');

async function addGetUpdateRemove(allMessages){

	await mongoose.connection.dropDatabase();


	let user = await userMod.addUser({name:'Viktor', age:18, email: 'viktor@mail.com', password: 'helloworld', country:'Afgan'});
	let chat = await chatMod.addChat('first chat',user.id,false);

	if(!allMessages){
		let msg = await addMessage('hello world', user.id, chat._id);


		let id = msg._id;
		console.log('old value '+msg.body);


		let m = await getMessage(id);

		let lastKey = m._id;
		//console.log(lastKey);

		let updatedValue = await updateMessage(lastKey, 'hello tiny apartment');
		console.log('new value '+updatedValue.value.body);

		let updatedKey = updatedValue.value._id;
		//console.log(updatedValue)
		let popped = await removeMessage(updatedKey);

		console.log('deleted: '+popped)
	}else{

		let msg = await addMessage('hello world', user.id, chat._id);

		//let msg = await addMessage('hello world', user.id, chat._id);

		let msg2 = await addMessage('Hello everyone', user.id, chat._id);
		let msg3 = await addMessage('Welcome to our chat: '+chat.name, user.id, chat._id);
		let updres = await chatMod.updateChat(chat._id, {messages: [msg,msg2,msg3]});

		let amount = await chatMod.getChat({name: chat.name});

		console.log('length of added messages: '+amount.messages.length);

		let id = msg._id;
		console.log('old value '+msg.body);

		let m = await getMessage(id);

		let lastKey = m._id;
		//console.log(lastKey);

		let updatedValue = await updateMessage(lastKey, 'hello tiny apartment');
		console.log('new value '+updatedValue.value.body);

		let updatedKey = updatedValue.value._id;
		//console.log(updatedValue)
		let popped = await removeAllMessages(chat._id);

		console.log('deleted: '+popped)

}


mongoose.disconnect()


};*/


//addGetUpdateRemove(false);















