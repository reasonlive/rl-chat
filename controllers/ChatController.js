const BaseController = require('./BaseController');

class ChatController extends BaseController{

	/////////////////////////////////////////////////////////////
	//METHODS FOR CHAT CONTROLLER
	constructor() {
		super();
		this.model = this._model.getObject(this._entities.chat);
		return this;
	}

	async addChat(fields) {
		
		if(!fields.users && fields.creatorId) {
			fields.users = [fields.creatorId]
		}

		return await this.model.add(fields);
	}

	//@param {Object} fields are {nameOfChat,userId,isPrivate}
	async deleteChat(id){
		await this.model.delete(id);	
	}

 	async getChatData(id) {
		return await this.model.get(id);
	}

	// makeChatPrivate|Public

	//todo: check how it was with arrays
	async addMessage(id, messageId) {
		await this.model.update(id, {$push: {messages: messageId}});
	}

	async deleteMessage(id, messageId) {
		await this.model.update(id, {$pull: {messages: messageId}});
	}

	async addUser(id, userId) {
		await this.model.update(id, {$push: {users: userId}});
	}

	async deleteUser(id, userId) {
		await this.model.update(id, {$pull: {users: userId}});
	}
}

module.exports = ChatController;






