const express = require('express');
const upload = require('./upload');
const multer = require('multer');
//let upload = multer({dest:'public/img/avatars/'});
const router = express.Router();

const Facade = require('../../controllers');
const mongoose = require('../db');

const cfg = require('../config');

const getSessionUserInfo = require('./getSessionUser');



//when user enters to the chat that he chose
router.get('/chat', async function(req,res,next){
	if(!req.session || !req.session.t){
		/*let err = new Error('user is unathorized');
		err.name = 'UnauthorizedError';
		err.message = 'user is unathorized';*/
		console.log('no user and must be redirect')
		res.redirect('/');
		next();
	}
})

//Gets chat info via ajax request to render this on page
router.get('/chat/getData' , async function(req,res,next){

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
})



//////////////////////////////INSIDE CHAT//////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

//CRUD WITH MESSAGES
router.post('/chat/:act', async function(req,res,next){
	//need to check incoming data with regular expressions
	if(req.params.act === 'postMessage'){
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
	if(req.params.act === 'editMessage'){
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
	if(req.params.act === 'deleteMessage'){
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
	
})

//deletes current user from current chat
router.delete('/chat/deleteFrom', async function(req,res,next){
	if(req.body.chat){
		let chatId = req.body.chat;
		try{
			let loggedUser = await getSessionUserInfo(req);
			let user = await Facade.getUserData(loggedUser.id);
			user.chats.pull(chatId);
			await user.save();
			await Facade.deleteUserFromChat(loggedUser.id, chatId);
			res.send('success');
		}catch(e){
			console.log(e);
			res.send('failure');
		}
		
	}
})


module.exports = router;