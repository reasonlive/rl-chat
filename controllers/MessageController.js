const BaseController = require('./BaseController');

class MessageController extends BaseController {
	//////////////////////////////////////
	//METHODS FOR MESSAGE CONTROLLER
	constructor() {
		super();
		this.model = this._model.getObject(this._entities.message);
		return this;
	}

	//@param {Object} fields - creatorId, chatId, body  
	async addMessage(fields) {
		return await this.model.add(fields);
	}

	//@param {Otring} newMessage is a string of sending message
	async editMessage(id, userId, newMessage) {
		const {creatorId} = await this.getMessageData(id);
		
		if (String(creatorId) === String(userId)) {
			await this.model.update(id, {body: newMessage});
			return true;	
		} else {
			throw new Error('Message cannot be edited');
		}
	} 

	async deleteMessage(id, userId) {
		const {creatorId} = await this.getMessageData(id);

		if (String(creatorId) === String(userId)) {
			return await this.model.delete(id);
		} else {
			throw new Error('Message cannot be deleted');
		}
	}

	async deleteAllMessages(chatId) {
		await this.model.deleteAll({chatId});
	}

	async getMessageData(id) {
		return await this.model.get(id);
	}
}

module.exports = MessageController;
