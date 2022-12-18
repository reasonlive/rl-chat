const BaseController = require('./BaseController');

class UserController extends BaseController {
	//METHODS FOR USER CONTROLLER
	//////////////////////////////
	constructor() {
		super();
		this._model = require('../models/User');
		this.model = this._model.getObject(this._entities.user);
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

	async loginUser(email, password){

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
			ip: null, //todo: add IP-address
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
	static async editUserAccount(fields){

		if(!fields.id)return new Error('Operation forbidden!');
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

	
	//@param {Object} fields are id,time,forever
	static async banUser(fields){

		if(typeof fields !== 'object'){
			fields = {
				id: arguments[0],
				time: arguments[1] || 86400000,
				forever: arguments[2] || false,
			}
		}

		let banned = await User.banUser(fields);
		if(!banned)return new Error('NotFoundError/No such User');
		return banned;

	}

	//@param {Otring} status may be :
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
}

module.exports = UserController;










