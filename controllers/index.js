const userController = require('./user');
const chatController = require('./chat');
const groupController = require('./group');
const messageController = require('./message');




class Facade {


	//METHODS FOR USER CONTROLLER
	//////////////////////////////


	//name, email, password, country, age
	static async registerUser(fields){


		if(typeof fields !== 'object'){
			fields = {
				name: arguments[0],
				email: arguments[1],
				password: arguments[2],
				country: arguments[3],
				age: arguments[4],
			}
		}

		let added = await userController.addUser(fields);
		if(added.error)return new Error(added.message);

		return true;

	}

	static async loginUser(fields){
		
		if(typeof fields !== 'object'){
			fields = {
				email: arguments[0],
				password: arguments[1],
				ip:arguments[2],
			}
		}

		let {email,password,ip} = fields;
		
		let user = await userController.loginUser(email,password);
		if(!user)return new Error('NotFoundError/No such User');
		if(user instanceof Error)return user;

		user.lastIpLog = {
			ip:ip,
			date: Date.now()
		}

		//Checking if user is online and block the entry if so
		
		if(await Facade.isOnline(user.id)){
			return new Error('OnlineError/User is already online');
		}

		try{
			user.online = true;
			user.checkBan();
			await user.save();
		}catch(e){
			return new Error(e.name+"/"+e.message);
		}
		return {
			name: user.name,
			id: user._id
		}
		
	}

	static async logoutUser(id){
		try{
			let user = await userController.getUser({_id:id});
			user.online = false;
			await user.save();
			return true;
		}catch(error){
			return {
				error:true,
				message: error.message,
				name: error.name
			}
		}
	}


	static async getUserId(name){ //or possibly email
		const user = await userController.getUser({name});
		if(!user)return new Error('NotFoundError/No such User');
		return user._id;
	}

	static async getUserData(id){
		const user =  await userController.getUser({_id:id});
		if(!user)return new Error('NotFoundError/No such User');
		else return user;
	}

	static async getIp(userId){
		const ip = await userController.getUserIp(userId);
		if(!ip)return new Error('NotFoundError/No such User');
		else return ip;
	}

	//last logged user seek by last log ip
	static async getLastLoggedUser(ip){
		let user = await userController.findByIp(ip);
		if(!user)return null;

		return user;

	}


	static async deleteUser(id){
		try{

			let user = await Facade.getUserData(id);
			let chats = user.chats;

			for(let chat of chats){
				try{
					await Facade.deleteUserFromChat(id,chat);
				}catch(e){
					continue;
				}
				
			}

			let deleted = await userController.removeUser(id);
			if(!deleted)return new Error('NotFoundError/No such User');

			return true;
		}catch(e){
			return e;
		}	
	}


	/*//@argument {object} fields are {
		id,
		newPassword,
		country,
		name,
		tags,
	}*/

	static async editUserAccount(fields){

		if(!fields.id)return new Error('Operation forbidden!');
		if(fields.newPassword){

			let result = await userController
			.changePassword(fields.id, fields.newPassword);

			if(!result)return new Error('NotFoundError/No such User');
			if(result instanceof Error)return result;

			delete fields.newPassword;


		}

		if(fields.tags){
				
			let added = await Facade.updateUserTags(fields.id, {name:'tags', array:fields.tags}, true);
			if(added instanceof Error)return added;
			delete fields.tags;
		}
		
		
		let editedUser = await userController.updateUser(fields.id, fields);
		if(!editedUser) return new Error("NotFoundError/No such User");
		else return editedUser;
	}



	static async addChatToUser(id, chatId){
		try{

			let user = await Facade.getUserData(id);
			user.chats.push(chatId);
			await user.save();
			return true;
		}catch(e){
			return {
				error:true,
				message: error.message,
				name: error.name
			}
		}
	}

	static async addGroupToUser(id, groupId){
		try{

			let user = await Facade.getUserData(id);
			user.groups.push(chatId);
			await user.save();
			return true;
		}catch(e){
			return {
				error:true,
				message: error.message,
				name: error.name
			}
		}
	}

	static async updateUserTags(id, tags){

		const maxTagLength = 5;
		if(tags.length > maxTagLength){
			return new Error('Max length of tags: '+maxTagLength);
		}

		try{
			let result = await userController.updateArray(id, {name:'tags', array:tags},true);
			return result;
		}catch(e){
			return new Error(e.name+"/"+e.message);
		}
	}

	/*static async deleteTagFromUser(id, tags){
		try{
			let user = await Facade.getUserData(id);
			user.tags.concat(tags);
			await user.save();
			return true;
		}catch(e){
			return new Error(e.message);
		}
	}
*/
	//@argument {object} fields are id,time,forever
	static async banUser(fields){

		if(typeof fields !== 'object'){
			fields = {
				id: arguments[0],
				time: arguments[1] || 86400000,
				forever: arguments[2] || false,
			}
		}

		let banned = await userController.banUser(fields);
		if(!banned)return new Error('NotFoundError/No such User');
		return banned;

	}

	static async isBanned(id){
		let user = await Facade.getUserData(id);
			if(user.ban.banned)return true;
			else return false;
	}

	

	static async isAdmin(id){
		let user = await Facade.getUserData(id);
		if(user.admin)return true;
		else return false;
	}

	static async isOnline(id){
		let user = await Facade.getUserData(id);
		if(user.online)return true;
		else return false;
	}



	//@argument {String} status may be :
	//newbie, calm, provocative, heckler, smartass, asshole, prettyboy, oldfashion, advanced, finefellow, 

																		static async setUserStatus(id, status){

																			const statuses = ['newbie', 'calm', 'provocative',
																			 'heckler', 'smartass', 'asshole', 'prettyboy',
																			  'oldfashion', 'advanced', 'finefellow'];

																			  if(!statuses.includes(status))
																			  	return new Error('NofFoundError/No such Status');

																			
																			try{
																				let user = await Facade.getUserData(id);
																				user.status = status;
																				await user.save();
																				return true;
																			}catch(e){
																				return new Error(e.name+"/"+e.message);
																			}
																		}

																		//estimate set by 100 point scale or below 0
																		static async setUserEstimate(id, estimate){

																			if(typeof estimate !== 'number' || 
																				estimate > 100)return new Error('NotFoundError/No such Estimate');

																			
																			try{
																				let user = await Facade.getUserData(id);
																				user.estimate = estimate;
																				await user.save();
																				return true;
																			}catch(e){
																				return new Error(e.name+"/"+e.message);
																			}
																		}
	//@argument {object} option may be one of these:  
	//amount,online,banned,names,ids,admin =============================>

	static getAllUsers = async function(option){

		try{
			let users = await userController.getAllUsers(option);
			return users;
		}catch(e){
			return new Error(e.name+"/"+e.message);
		}
	}




																		static async getOnlineUsers(){
																			let users = await Facade.getAllUsers({online:true});
																			if(users instanceof Array)return users;
																			else return new Error('Database Error (Users)');
																		}

																		static async getBannedUsers(){
																			let users = await Facade.getAllUsers({banned:true});
																			if(users instanceof Array)return users;
																			else return new Error('Database Error (Users)');
																		}

																		static async getUsersLength(){
																			let arr = await Facade.getAllUsers({amount:true});
																			if(typeof arr === 'number')return arr;
																			else return new Error('Database Error (Users)');
																		}

																		static async getUsersNames(){
																			let users = await Facade.getAllUsers({names:true});
																			if(users instanceof Array)return users.map(user=>user.name);
																			else return new Error('Database Error (Users)');
																		}

																		static async getUsersIds(){
																			let users = await Facade.getAllUsers({ids:true});
																			if(users instanceof Array)return users.map(user=>user._id);
																			else return new Error('Database Error (Users)');
																		}

																		static async getAllUsersInfo(){
																			let all = await Facade.getAllUsers({all:true});
																			if(all instanceof Array){
																				let returned = [];
																				for(let item of all){
																					let user = {
																						//name,age,country,registered,status,estimate,tags,avatar
																						avatar: item.avatar,
																						name:item.name,
																						age:item.age,
																						country:item.country,
																						status: item.status,
																						estimate:item.estimate,
																						tags: item.tags,
																						_id: item._id
																					}
																					returned.push(user);
																				} 
																				return returned;
																			}
																		}

	



	/////////////////////////////////////////////////////////////
	//METHODS FOR CHAT CONTROLLER




	//@argument {object} fields are {nameOfChat,userId,isPrivate}
	static async addChat(fields){
		let added;
		if(typeof fields === 'object'){
			try{
				let {name, creator, isPrivate} = fields;
				added = await chatController.addChat(name, creator, isPrivate);
				if(!added)return new Error('Chat Duplicate Error');
				if(added.error)return new Error(added.name+'/'+added.message);
			}catch(e){
				return e;
			}
			
		}else{
			try{
				added = await chatController.addChat(arguments[0], arguments[1], arguments[2]);
				if(!added)return new Error('Chat Duplicate Error');
				if(added.error)return new Error(added.name+'/'+added.message);
			}catch(e){
				return e;
			}
			
		}

	
		return added;

	}

	static async deleteChat(id){
		
		try{
				let removed = await chatController.removeChat(id);
			if(!removed)return new Error('NotFoundError/No such Chat');

			return true;
		}catch(e){
			return e;
		}
		
	}

	static async getChatId(name){

		let chat = await chatController.getChat({name});
		if(!chat)return new Error('NofFoundError/No such Chat');
		else return chat._id;
		
	}

	static async getChatData(id){

		let chat = await chatController.getChat({_id: id});
		if(!chat)return null;
		else return chat;
	}

	static async getChatMessages(id){
		
		let chat = await Facade.getChatData(id);
		return chat.messages;
	}

	static async getChatPeople(id){
		let chat = await Facade.getChatData(id);
		return chat.people;
	}



	static async makeChatPrivate(chat){ //chat may be _id or chatname

		if(chat.match(/^[0-9abcdef]{24}$/)){
			let result  = await chatController.getChat({_id: chat});
			if(!result)return new Error('NofFoundError/No such Chat');
			else result.isPrivate = true;
			await result.save();
		}else{
			let result  = await chatController.getChat({name: chat});
			if(!result)return new Error('NotFoundError/No such Chat');
			else result.isPrivate = true;
			await result.save();
		}
 
		return true;
	}

	static async makeChatPublic(chat){ // chat may be _id or chatname

		if(chat.match(/^[0-9abcdef]{24}$/)){
			let result  = await chatController.getChat({_id: chat});
			if(!result)return new Error('NotFoundError/No such Chat');
			else result.isPrivate = false;
			await result.save();
		}else{
			let result  = await chatController.getChat({name: chat});
			if(!result)return new Error('NotFoundError/No such Chat');
			else result.isPrivate = false;
			await result.save();
		}
 
		return true;
	}

	static async getAllChats(){
		let array = await chatController.getAllChats();
		if(array instanceof Error)return array;

		let returned = [];

		for (let item of array){
			let month = item.date.getMonth()+1;
			let date = item.date.getDate()+"-"+month+"-"+item.date.getFullYear();
		
			let map = {
				name: item.name,
				creator: item.creator,
				date: date,
				messages: item.messages.length,
				people: item.people.length,
				private: item.isPrivate ? 'private' : false,
				_id: item._id
				
			}

			returned.push(map);
			
		}

		return returned;
	}

	
	//when user first time enters to the chat
	static async postUserToChat(id, userId){ 
  
		
			let user = await userController.getUser({_id:userId});
			if(!user)return new Error('NotFoundError/No such User');

			let chat = await Facade.getChatData(id);
			if(chat instanceof Error)return chat;
			
			if(chat.people.includes(user._id))return new Error('PostUser Duplicate Error');
			chat.people.push(user._id);
			await chat.save();
		

		return true;

	}


	//maybe it will be private helper
	static async postMessageToChat(id, message){

		let chat = await Facade.getChatData(id);

		if(!chat)return new Error("NotFoundError/No such Chat");
		if(chat instanceof Error)return chat;

		chat.messages.push(message);
		await chat.save();

		return true;
	}

	
	static async deleteUserFromChat(userId,chatId){

			if(!userId.match(/^[0-9abcdef]{24}$/)){
				return next(new Error('NotFoundError/No such User')); 
			}
				
			try{
				let chat = await Facade.getChatData(chatId);
				if(chat.creatorId !== userId){
					let user = await Facade.getUserData(userId);
					user.chats.pull(chat._id);
					await user.save();
				}
				if(chat instanceof Error)return chat;

				chat.people.pull(userId); 
				await chat.save();
			}catch(e){
				return e;
			}

			
		

		return true;

	}


	//@argument {ObjectId} message _id
	static async deleteMessageFromChat(id, messageId){

		try{
			let chat = await Facade.getChatData(id);
			if(chat instanceof Error)return chat;

			chat.messages.pull(messageId);
			await chat.save();
		}catch(e){
			return new Error(e.error+"/"+e.message);
		}

		

		return true;
	}



	//////////////////////////////////////
	//METHODS FOR MESSAGE CONTROLLER




	//@argument {ObjectId} message Message._id everywhere
	//@argument {ObjectId} user, chat, ids of models
	static async postMessage(message, user, chat,gen){
		
	
		let result = await messageController.addMessage(message,user,chat,gen);
		if(result.error)return new Error(result.name+'/'+result.message);
		let addedToChat = await Facade.postMessageToChat(chat, gen);
		if(addedToChat instanceof Error)return addedToChat;
		
		return result;
	}

	//@argument {String} newMessage is a string of sending message
	static async editMessage(message, newMessage){
		let result = await messageController.updateMessage(message,newMessage);
		if(!result)return new Error('NotFoundError/No such message');
		if(result.error)return new Error(result.name+'/'+result.message);

		/*try{
			let chat = await Facade.getChatData(result.chatId);
		}catch(e){return new Error(e.name+"/"+e.message);}*/
		
		

		return result;
	} 

	static async deleteMessage(message){
		let chatId = await Facade.getWherePostedChatId(message);
		let result = await messageController.removeMessage(message);
		if(!result)return new Error('NotFoundError/No such message');
		if(result.error)return new Error(result.name+'/'+result.message);

		
		let resp = await Facade.deleteMessageFromChat(chatId,message);
		if(resp instanceof Error)return resp;

		else return result;
	}

	static async deleteAllMessages(chatId){
		let result = await messageController.removeAllMessages(chatId);
		if(!result)return new Error("NotFoundError/No such chat");
		if(result.error)return new Error(result.name+'/'+result.message)
		return result;
	}

	static async getMessageData(message){
		let msg = await messageController.getMessage(message);
		if(!msg)return null;
		if(msg.error)return new Error(msg.name+'/'+msg.message);

		return msg;
	}

	static async getMessageDataByQuery(query){
		let msg = await messageController.getMessageByQuery(query);

		if(!msg)return new Error('NotFoundError/No such message');
		if(msg.error)return new Error(msg.name+'/'+msg.message);

		return msg;
	}

	static async getSenderId(message){
		let msg = await messageController.getMessage(message);
		if(!msg)return new Error('NotFoundError/No such message');
		if(msg.error)return new Error(msg.name+'/'+msg.message);

		return msg.creatorId;
	}

	//perhaps it will be private helper
	static async getWherePostedChatId(message){
		let msg = await messageController.getMessage(message);
		if(!msg)return new Error('NotFoundError/No such message');
		if(msg.error)return new Error(msg.name+'/'+msg.message);

		return msg.chatId;
	}

	static async getSenderName(message){
		let msg = await messageController.getMessage(message);
		if(!msg)return new Error('NotFoundError/No such message');
		if(msg.error)return new Error(msg.name+'/'+msg.message);

		let user = await Facade.getUserData(msg.creatorId);
		return user.name;
	}



	//////////////////////////////////////
	//METHODS FOR GROUP CONTROLLER



	static async addGroup(){

	}

	static async deleteGroup(){

	}

	static async getGroupData(groupId){
		let data = await groupController.getGroup({_id:groupId});
		if(!data)return null;
		if(data instanceof Error)return data;

		return data;

	}

	static async banGroup(){

	}

	static async makeGroupPrivate(groupId){

	}

	static async makeGroupPublic(groupId){

	}

	static async getInTheGroup(userId,groupId){

	}

	static async getOutTheGroup(userId,groupId){

	}

	static async addChatToGroup(chatId,groupId){

	}

	static async deleteChatFromGroup(chatId,groupId){

	}

	static async getGroupChats(groupId){

	}

	static async getGroupUsers(groupId){

	}

	static async getAllGroups(){
		let groups = await groupController.getAllGroups();
		if(groups instanceof Error)return groups;

		//name,creator,date,chats,people,isprivat,ban

		let returned = [];

		for (let item of groups){
			let month = item.date.getMonth()+1;
			let date = item.date.getDate()+"."+month+"."+item.date.getFullYear();
		
			let map = {
				name: item.name,
				creator: item.creator,
				date: date,
				chats: item.chats.length,
				people: item.people.length,
				private: item.isPrivate ? 'private' : false,

				
			}

			returned.push(map);
			
		}

		return returned;
	}



}




module.exports = Facade;



														///////////TESTS///////////////
														///////////////////////////////
														///////////TESTS///////////////




const requestToDatabase = async (data, callback)=>{

	
	const mongoose = require('../custom/db');

	//await mongoose.connection.dropDatabase();

	let result = await callback(data);

	await mongoose.connection.close();

	return result;
	
}

/*const facade = new Facade();

facade.registerUser('Nick', 22, 'Pasadena', 'nick@mail.ru').then(result=>console.log(result))*/

const id = '5fec1c799a9fac0e5badbc1a';
const id2 = '5fec1c799a9fac0e5badbc1b';
const id3 = '5fec1c799a9fac0e5badbc1c';

const chatId = '5fec1ec43ccbee0efebeba92';

const name =  'Sasha';

const data = {
	name: 'First chat', 
	creator: 'Viktor',
	isPrivate: false
}

const userdata = {
	name: "nick",
	age:20,
	country: "Belgrad",
	password: 'hello',
	email: 'nick@mail.ru'
}

const userdatamike = {
	name: "mike",
	age:20,
	country: "Belgrad",
	password: 'hello',
	email: 'mike@mail.ru'
}

const userdatajack = {
	name: "jack",
	age:20,
	country: "Belgrad",
	password: 'hello',
	email: 'jack@mail.ru'
}

const data2 = {
	_id: id,
	user: "Valentin"

}







async function test(){

	const mongoose = require('../lib/db');

	console.log('\n\n\n')

		mongoose.connection.on('close', function(){
			console.log('\n\n\n----------------------------------')
			console.log('database was closed');
			console.log('test is over');
			process.exit();
		})

		/*let chat = await Facade.addChat('first my chat', id, false);
		console.log(chat);*/
		
		
		
		//let id = await Facade.getUserId('nick');
		//console.log(await Facade.getUserData(id2))
		//////////////ADD TAGS,ESTIMATE AND STATUS/////////////////////////
		//console.log(await Facade.addTagToUser(nickId, ['youtube', 'performer', 'developer']));
		//console.log(await Facade.setUserEstimate(nickId,'sdkljfklsd'));
		//console.log(await Facade.setUserStatus(nickId,'ballatron'));
		//////////////ADD TAGS,ESTIMATE AND STATUS/////////////////////////



		//////////////CHAT MESSAGES AND CHAT PEOPLE///////////////////
		//let msgs = await Facade.getChatMessages(chatId);
		//await postMessage('hello world', )
		//console.log(await Facade.getMessageData(msgs[0]))
		/*console.log(await Facade.postUserToChat(chatId,id));
		console.log(await Facade.postUserToChat(chatId,id2));
		console.log(await Facade.postUserToChat(chatId,id3));*/
		//console.log(await Facade.getUserData(id))
		//console.log(await Facade.getChatData(chatId))
		//console.log(await Facade.deleteUserFromChat(id,'5fec1ec43ccbee0efebeba92'));
		//console.log(await Facade.getChatData('5fec1ec43ccbee0efebeba92'));
		//console.log(await Facade.postMessage('hello world', id, chatId));
		//await Facade.postMessage('I am from the Belarus', id2, chatId);
		//await Facade.postMessage('Write now Im going to go at work', id3, chatId); 
		//console.log(await Facade.getChatData(chatId));




		//console.log(await Facade.getChatMessages(chatId))
		//console.log(await Facade.getChatPeople(chatId))
		//////////////CHAT MESSAGES AND CHAT PEOPLE///////////////////


		////////////BAN FUNCTIONS//////////////////////
		//console.log(await Facade.banUser(nickId,60000*2,false));
		//onsole.log(await Facade.isBanned(nickId))
		////////////BAN FUNCTIONS//////////////////////


		console.log(await Facade.getUserData(id))
		console.log(await Facade.getChatData('5ffa1577374b9373483c5dea'))
		/*console.log(await Facade.registerUser(userdata));
		console.log(await Facade.registerUser(userdatamike));
		console.log(await Facade.registerUser(userdatajack));

		console.log(await Facade.getAllUsersInfo());*/
		//console.log(await Facade.logoutUser(nickId));

		

		//let ch = await Facade.getChatId('first');

		//console.log(await Facade.getMessage(msgId));


	

	mongoose.connection.close();



}

//test()
 

