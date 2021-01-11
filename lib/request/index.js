const express = require('express');
const router = express.Router();

const Facade = require('../../controllers');
const mongoose = require('../db');

const cfg = require('../config');
const jwt = require('jsonwebtoken');

const getSessionUserInfo = require('./getSessionUser');



router.use('/', async function(req,res,next){

	//if session is new it checks online user property
	if(req.session.isNew){
		let user = await Facade.getLastLoggedUser(req.client.remoteAddress);

		if(user && user.online){
			user.online = false;
			await user.save();

		}
		
	}
	next()
	
})


//ajax request to verify user who has just logged on the website
router.get('/_user', async function(req,res,next){
	
	if(req.headers['sec-fetch-mode'] === 'navigate'){
		return;
	}

	if(!req.session || !req.session.t){
		res.json({unlogged:true});
		return next();
	}
		
		jwt.verify(req.session.t, cfg.jwtKey, async function(err, body){
			if(err)next(err);
			if(body.name){
				let data = await Facade.getUserData(body.id);
				if(!data)return next();
				
				if(data instanceof Error)next(data);
				let chatNames = [],groupNames = [];
				data = data._doc;
				for(let id of data.chats){
					if(data.chats.length < 1)break;
					let chat = await Facade.getChatData(id);
					if(!chat)continue;
					chat = chat._doc;
					chatNames.push({name:chat.name,id:chat._id});	
					
				}
				for(let id of data.groups){
					if(data.groups.length < 1)break;
					let group = await Facade.getGroupData(id);
					groupNames.push({name:group.name,id:group._id});
				}
				data.chats = chatNames;
				data.groups = groupNames;

				res.json(data);
			}
		})
		//next()
})



//receives user's email and password and logges user
router.post('/login', async function(req,res,next){
	
	if(req.query.act === 'l'){

		if(!req.body)next(new Error('Login:Invalid Data'));

		let {email,password} = req.body;


		
		//Check if user is in database and log him in
		let result = await Facade.loginUser(email,password,req.client.remoteAddress);
		if(result instanceof Error){
			res.json({success:false,error:result.message});
			
		}

		//set up jwt token and attach it to the session
		let payload = {
			name: result.name,
			id: result.id,
			exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
		}

		const token = jwt.sign(payload, cfg.jwtKey);
		req.session.t = token;
		//res.send('success');
		res.json({success:true,name:result.name});	

	}
	next()
	
})

//when user leaves the app
router.get('/logout/:key', async function(req,res,next){
	
	if(req.params.key === 'byajax' && req.headers['sec-fetch-mode'] !== 'navigate'){
		let user = await getSessionUserInfo(req);
		let result = await Facade.logoutUser(user.id);
		if(result instanceof Error)return next(result);
		else{
			req.session = null;
			res.send('success');
		}
	}
})

//register user and checks if user is alerady exists in database
router.post('/registration', async function(req,res,next){
	if(!req.body)next(new Error('Registration:Invalid Data'));
	let result = await Facade.registerUser(req.body);
	if(result instanceof Error){
		res.json({success:false,error:result.message});
		next(result);
	}else{
		res.json({success:true});
	}
})

//when a guest looks over chat on the website 	
router.get('/chats/:act', async function(req,res,next){
	
			
			if(req.params.act === 'getInfo'){
				let chats = await Facade.getAllChats();
				if(chats instanceof Error)next(chats);
				res.json({chats:chats});
			}
			if(req.params.act === 'enter'){

			}
			//next()
	
});

//when a guest looks over groups on the website 	
router.get('/groups/:act', async function(req,res,next){
			
			if(req.params.act === 'getInfo'){
				let groups = await Facade.getAllGroups();
				if(groups instanceof Error)next(groups);
				res.json({groups:groups});
			}
			//next()
	
	
});

//when a guest looks over people on the website 	
router.get('/people/:act', async function(req,res,next){
			
			if(req.params.act === 'getInfo'){
				let users = await Facade.getAllUsersInfo();
				if(users instanceof Error)next(users);
				res.json({users:users});
			}
			//next()
	
});

//when user logged on the website
router.get('/main', async function(req,res,next){
	if(!req.session || !req.session.t){
		/*let err = new Error('user is unathorized');
		err.name = 'UnauthorizedError';
		err.message = 'user is unathorized';*/
		
		res.redirect('/');
		next();
	}
	next()
})

//takes all data about chats , groups and users on the app/
//and renders data in tables
router.get('/main/getData', async function(req,res,next){


	//if request was made by browser query
	if(req.headers['sec-fetch-mode'] === 'navigate'){
		let error = new Error();
		error.name = 'NotFoundError';
		error.message = '404: Page not found';
		return next(error);
	}

	let chats = await Facade.getAllChats();
	if(chats instanceof Error)next(chats);

	let groups = await Facade.getAllGroups();
	if(groups instanceof Error)next(groups);

	let users = await Facade.getAllUsersInfo();
	if(users instanceof Error)next(users);
	
	res.json({chats:chats,groups:groups,users:users});
	//next();
})






function validateFields(fields){
	if(fields.email && fields.email.match(/^$/)){

	}
}




 
module.exports = router;

