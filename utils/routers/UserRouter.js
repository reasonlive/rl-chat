const {Router} = require('express');
const {ClientRequestError} = require('../Errors');

const {UserController} = require('../../controllers');

console.log(Router) 

class UserRouter extends Router {

	constructor() {
		super();
		this.controller = new UserController();
	}

	static getMiddleware() {
		const router = new this();

		router.post('/registration', router.handleRegistration);
		router.post('/login', router.handleLogin);
		router.get('/logout/:key', router.handleLogout);

		router.get('/_user', router.handleUserDataRequest);

		// profile
		router.use('/profile', router.checkAuthentication);
		router.post('/profile/settings', router.handleProfileSettings);
		router.get('/profile/view', router.handleProfileView);

		return router;
	}

	async handleRegistration(req, res, next) {
		if (!req.body) {
			next(new ClientRequestError('Invalid user data'));
		}

		try {
			await controller.reqisterUser(req.body);
			res.json({success: true})			
		} catch(err) {
			res.json({success: false, error: err});
		}
	}

	async handleLogin(req, res, next) {
		if (req.query.act !== 'l') {
			next(new ClientRequestError('Act not equal l'));
		}

		if (!req.body) {
			next(new ClientRequestError('Invalid user data'));
		}

		const {email, password} = req.body;
		const ip = req.client.remoteAddress;

		const {id, name} = await this.controller.loginUser(email, password, ip);

		//set up jwt token and attach it to the session
		req.session.t = this.controller.model.getSessionUserToken(id, name);
		//res.send('success');
		res.json({success:true, name});	
	}

	async handleLogout(req, res, next) {
		if (
				req.params.key === 'byajax'
				&& req.headers['sec-fetch-mode'] !== 'navigate'
		  ) {
				const {id} = await getSessionUserInfo(req);
				if (await this.controller.logoutUser(id)) {
					req.session = null;
					res.json({success: true})
				} else {
					res.json({success: false});
			}
		}
	}

	// use: /profile
	checkAuthentication(req, res, next) {
		if (!req.session || !req.session.t) {
			res.redirect('/');
			return;
		}
	}

	// post: /profile/settings
	async handleProfileSettings(req, res, next) {
		if(!req.body) {
			next(new ClientRequestError('User data not provided'));
		}

		const {id} = await this.controller.getSessionUserInfo(req);
		await this.controller.editUserSettings(id, req.body);
	}

	// get: /profile/view
	async handleProfileView(req, res, next) {

		if (req.headers['sec-fetch-mode'] === 'navigate') {
			return;
			next()
		}

		const {id} = await this.controller.getSessionUserInfo(req);
		let userData = await this.controller.getUserData(id);

			let chats = [],groups = [];
			userData = userData._doc;
			//need to mutate chat data for profile page
			for(let id of userData.chats){
				if(userData.chats.length < 1)break;
				let chat = await Facade.getChatData(id);
				if(!chat)continue;
				let chatToClient = {
					name:chat.name,
					id:chat._id
				}
				
				if(chat.creatorId == user.id){
					chatToClient.owner = true;
				}
				chats.push(chatToClient);
			}

			//need to mutate group data for profile page
			for(let id of userData.groups){
				if(userData.groups.length < 1)break;
				let group = await Facade.getGroupData(id);
				let groupToClient = {
					name:group.name,
					id:group._id,
				}
				if(group.creatorId === user.id){
					groupToClient.owner = true;
				}
				groups.push(groupToClient);
			}

			//changes ids to objects of data: {name,id,owner}
			userData.chats = chats;
			userData.groups = groups;
			
			res.json(userData);
			next()
	}

	// get: /_user (ajax)
	// all user data with his chat and group names
	async handleUserDataRequest(req, res, next) {
		//ajax request to verify user who has just logged on the website

		if(req.headers['sec-fetch-mode'] === 'navigate'){
			return;
		}

		if (!req.session || !req.session.t) {
			res.json({logged: false});
			return next();
		}

		const {id} = await this.controller.model.getSessionUserInfo(req);
		const userData = await this.controller.getUserData(id);
		res.json(userData);
	}
}