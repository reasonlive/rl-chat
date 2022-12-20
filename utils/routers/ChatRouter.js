const {Router} = require('express');
const {ChatController} = require('../../controllers');

class ChatRouter extends Router {

	constructor() {
		super();
		this.controller = new ChatController();
	}

	static getMiddleware() {
		const router = new this();

		router.use('/', function(req, res, next) {
			console.log(req.session.isNew);
			next()
		})
		// main page
		router.use('/main', router.checkAuthentication);
		router.get('/main/view', router.handleMainView);
		// inside the chat
		router.use('/chat', router.checkAuthentication);
		router.get('/chat/view', router.handleChatView);
		router.post('/chat/message/:act', router.handleActions);

		return router;
	}

	checkAuthentication(req, res, next) {
		if (!req.session || !req.session.t) {
			res.redirect('/');
			return;
		}
	}

	async handleMainView(req, res, next) {
		//if request was made by browser query
		if(req.headers['sec-fetch-mode'] === 'navigate'){
			let error = new Error();
			error.name = 'NotFoundError';
			error.message = '404: Page not found';
			return next(error);
		}

		const chats = await this.controller.getAllChats();
		console.log(chats);
		//process.exit()

		//res.json({chats:chats,groups:groups,users:users});
	}

	// get: /chat/getData => /chat/view
	async handleChatView(req, res, next) {

		//Gets chat info via ajax request to render this on page

		//if request was made by browser query
		if(req.headers['sec-fetch-mode'] === 'navigate'){
			return next();
		}


		if(req.query.id){
			let chatId = req.query.id;
			//checking chat id: /^[0-9abcdef]{24}$/
			//gets name and id of logged user
			let loggedUser = await getSessionUserInfo(req);
			if(!loggedUser.id){
				res.redirect('/');
				return next()
			}
			
			let chatData = await Facade.getChatData(chatId);
			//makes chatData writable object
			chatData = chatData._doc;
			//put a check on owner
			chatData.owner = chatData.creatorId == loggedUser.id ? true : false;

			if(chatData instanceof Error)return next(chatData)
			let people = chatData.people;

			//check if user exists in the list of the chat or not
			if(!people.includes(loggedUser.id)){
				let res = await Facade.postUserToChat(chatId, loggedUser.id);
				if(res instanceof Error)next(res);
				res = await Facade.addChatToUser(loggedUser.id, chatId);
				if(res instanceof Error)next(res);
			}



			let messages = [],users = [];

			try{



				//it gets message's content info
				for(let msg of chatData.messages){
					if(chatData.messages.length < 1){
						
						break;
					}
					let msgData = await Facade.getMessageData(msg);
					if(msgData instanceof Error){
						break;
						return next(msgData)

					}
					if(!msgData){
						
						break;
					}	
					let creator = await Facade.getUserData(msgData.creatorId);
					if(creator instanceof Error){
						creator = {
							name: 'deleted',
							avatar: 'avatar.png'
						}
					}

					let sendInfo = {
						body: msgData.body,
						creator: creator.name,
						time: msgData.time,
						avatar: creator.avatar,
						loggedUser: loggedUser.name,
						id: msgData.genId,


					}
					messages.push(sendInfo);
				}

				//it gets users content info
				for(let user of people){
					if(people.length < 1){
						
						break;
					}
					let userData = await Facade.getUserData(user);
					let sendData = {
						avatar: userData.avatar,
						name: userData.name,
						status: userData.status,
						estimate: userData.estimate,
						online: userData.online
					}
					users.push(sendData);
				}
			}catch(e){
				return next(e);
			}
			
			res.json({chat:chatData,messages:messages,people:users});
		}else{
			res.json({chat:{name:'no query id'},messages:[],people:[]})
		}
	}

	// post: /chat/message/:act
	async handleActions(req, res, next) {
		//need to check incoming data with regular expressions
		if(req.params.act === 'post'){
			if(req.body){
				let {msg,chat,gen} = req.body;
				if(!msg || !chat || !gen)return;

				let currentUser = await getSessionUserInfo(req);
				
				if(msg && msg.length > 1000 || msg.length < 1){
					return;
				}

				
				
				let result = await Facade.postMessage(msg,currentUser.id,chat,gen);
				if(result instanceof Error)throw result;
				
				res.send('success')

			}
		}
		if(req.params.act === 'edit'){
			if(req.body){
				let currentUser = await getSessionUserInfo(req);
				let {msg,chat,body} = req.body;

				if(body && body.length > 1000 && body.length < 1){
					return;
				}
				if(!chat)return;

				let result = await Facade.editMessage(msg, body.trim());
				
				if(result instanceof Error){
					res.send('failure');
					next(result)
				}
				

				res.send('success');
			}
		}
		if(req.params.act === 'delete'){
			if(req.body){
				let currentUser = await getSessionUserInfo(req);
				let {msg,chat} = req.body;

				if(!msg  || !chat || msg.length > 1000){
					return;
				}
				
				let result = await Facade.deleteMessage(msg);
				if(result instanceof Error){
					res.send('failure');
					next(result);
				}
				

				res.send('success');

			}
		}
	}
}