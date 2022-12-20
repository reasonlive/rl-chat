const BaseController = require('./BaseController');

class UserController extends BaseController {
	//METHODS FOR USER CONTROLLER
	//////////////////////////////
	constructor() {
		super(require('../models/User'));
		this.model = this._model.getObject(this._entities.user);
		return this;
	}

	//name, email, password, country, age
	async registerUser(fields) {
		const userFields = {...fields};
		if(fields.password) {
			userFields.password = this.model.encodeValue(fields.password);
		}

		return await this.model.add(userFields);
	}

	async deleteUsers() {
		return await this.model.deleteAll();
	}

	async loginUser(email, password, ipAddress = null){

		const user = await this.model.get({email});

		if (!user) {
			return new Error('User not found');
		}

		if (password !== this.model.decodeValue(user.password)) {
			return new Error('Invalid Password');
		}

		if (user.online) {
			return new Error('User is logged')
		}

		if (user.ban.banned) {
			return new Error('User has a ban');
		}

		const lastIpLog = {
			ip: ipAddress,
			date: Date.now()
		}

		await this.model.update(user._id, {
			lastIpLog,
			online: true
		});
		
		return {
			name: user.name,
			id: user._id
		}
	}

	async logoutUser(id){
		try {
			await this.model.update(id, {online: false});
			return true;			
		} catch(err) {
			console.log(err.name)
			return false;
		}
	}

	async deleteUser(id) {
		try {
			return await this.model.delete(id);
		} catch(err) {
			console.log(err)
			return false;
		}	
	}


	/**
	 * @param {Object} fields are {id,newPassword,country,name,tags}
	 */
	async editUserSettings(id, fields) {

		if(!id)return new Error('Operation forbidden!');
		if(fields.newPassword){

			let result = await User
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
		
		
		let editedUser = await User.updateUser(fields.id, fields);
		if(!editedUser) return new Error("NotFoundError/No such User");
		else return editedUser;
	}

	// todo: create methods for foreign keys of other models
	async getUserData(id) {
		const data = await this.model.get(id);

		const chatNames = [];
		const groupNames = [];

		for (let id of data.chats) {
			if (data.chats.length < 1) {
				break;
			}

			const {name, _id} = await this.model.getReferenceObject(id, this._entities.chat);
			chatNames.push({name, id: _id});	
		}

		for (let id of data.groups) {
			if (data.groups.length < 1) {
				break;
			}

			const {name, _id} = await this.model.getReferenceObject(id, this._entities.group);
			groupNames.push({name, id: _id});	
		}

		data.chats = chatNames;
		data.groups = groupNames;
	}

	
	//@param {Object} fields are id,time,forever
	async banUser(id, dateTo, forever = false) {
		fields = {
				id,
				dateTo,
				forever,
		}
		
		//todo: update ban fields
	}

module.exports = UserController;










