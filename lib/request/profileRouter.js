const express = require('express');
const upload = require('./upload');
const multer = require('multer');
//let upload = multer({dest:'public/img/avatars/'});
const router = express.Router();

const Facade = require('../../controllers');
const mongoose = require('../db');

const cfg = require('../config');
//const jwt = require('jsonwebtoken');

const getSessionUserInfo = require('./getSessionUser');


//checks if user authenticated
router.get('/profile', async function(req,res,next){
	if(!req.session || !req.session.t){
		res.redirect('/');
		return;
	}

	next()
})

//gets the data about user when user logged and goes to the profile page
router.get('/profile/getData', async function(req,res,next){

	if(req.headers['sec-fetch-mode'] === 'navigate'){
		return;
		next()
	}

	

	let user = await getSessionUserInfo(req);
	let userData = await Facade.getUserData(user.id);
	if(userData instanceof Error)return next(userData);

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
})

router.post('/profile/checkPass', async function(req,res,next){
	if(req.body.password && req.body.password.length < 30){
		let sessionUser = await getSessionUserInfo(req);
		let user = await Facade.getUserData(sessionUser.id);

		if(user.checkPassword(req.body.password)){
			res.send('success');
		}else{
			res.send('failure');
		}
		next();
	}
})

router.post('/profile/changePass', async function(req,res,next){

	if(req.body.password && req.body.password.length < 30){
		let sessionUser = await getSessionUserInfo(req);

		let result = await Facade.editUserAccount({id: sessionUser.id, newPassword: req.body.password});
		if(result instanceof Error)return result;
		else res.send('success');	
		next();
	}
})

//nowadays user can change name and country only
router.post('/profile/changeInfo', async function(req,res,next){

		
		let sessionUser = await getSessionUserInfo(req);

		let {username,country} = req.body;
		if(username){
			//checks if such name already exists
			let result = await Facade.editUserAccount({id:sessionUser.id, name:username});
			if(result instanceof Error)return result;
		}
		if(country){
			let result = await Facade.editUserAccount({id:sessionUser.id, country:country})
			if(result instanceof Error)return result;
		}
		res.send('success');	
		next();
	
})



router.post('/profile/uploadAvatar', upload.uploadAvatar(), async function(req,res,next){
	
	let user = await getSessionUserInfo(req);
	let filename = upload.checkUploadedFile(req);
	if(!filename){
		return next(new Error('UploadError/File must be an image and less then 2mb'));
	}
	else{
		let result = await Facade.editUserAccount({id: user.id, avatar: filename});
		if(result instanceof Error){
			res.send(result.message);
			return next(result);
		}

		res.send('success');
	}
	next();
})

router.post('/profile/addTags', async function(req,res,next){

	if(req.body.tags){

		let arr = req.body.tags.split('#');
		arr.shift()
		arr = arr.map(elem=> '#'+elem);
		
		let user = await getSessionUserInfo(req);

		let result = await Facade.updateUserTags(user.id, arr);
		if(result instanceof Error)return next(result);
		else res.send('success');
	}
})



router.post('/profile/addChat', async function(req,res,next){
	if(!req.body.name || req.body.name.length > 80){
		res.send('failure');
		return next();
	}

	let user = await getSessionUserInfo(req);
	let chat = await Facade.addChat(req.body.name,user.id,false);
	if(chat instanceof Error){
		res.send(chat);
		next(chat);
		return;
	}
	res.send('success');

})

router.post('/profile/addGroup', async function(req,res,next){

})




















//deletes use profile
router.delete('/profile/delProfile', async function(req,res,next){



	let user = await getSessionUserInfo(req);
	let result = await Facade.deleteUser(user.id);
	if(result instanceof Error)return next(result);
	else{
		req.session = null;
		res.send('success');
	}

})


router.delete('/profile/delGroups', async function(req,res,next){

})


router.delete('/profile/delChats', async function(req,res,next){

	if(req.body.chat){
		if(checkOnId(req.body.chat)){
			let result = await Facade.deleteChat(req.body.chat);
			if(result instanceof Error)return next(result);
			else res.send('success');
		}else{
			res.send('failure');
			next();
		}	
	}else if(req.body.chats && Array.isArray(req.body.chats)){
		next()
	}

})

//deletes user from chats created not by him
router.post('/profile/delFromChats', async function(req,res,next){

		if(req.body.chatId && checkOnId(req.body.chatId)){
			let user = await getSessionUserInfo(req);

			let result = await Facade.deleteUserFromChat(user.id, req.body.chatId);
			if(result instanceof Error)return next(result);
			else res.send('success');
			next()
		}
})


module.exports = router;


async function checkOnId(value){
	return value.match(/^[0-9abcdef]{24}$/) ? true : false;
}
