const express = require('express');
const app  = express();
const cfg = require('./config');

//main router
const router = require('./utils/router');
//profile page router
const profileRouter = require('./utils/router/profileRouter');
//chat page router
const chatRouter = require('./utils/router/chatRouter');


const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

app.use(express.static(__dirname+'/build'));
app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieSession({
	secret: cfg.sessionKey,
	maxAge: 24 * 60 * 60 * 1000,
}))




app.use('/', [router,chatRouter,profileRouter], function(req,res,next){
	if(res.headersSent)return;
	res.sendFile(__dirname+'/build/index.html',{},function(err){
		if(err)next(err);
	});
})




app.use(function(err,req,res,next){

console.error(err);
if(err.name === 'UnhandledPromiseRejection'){
	console.log(err.message)
}
/*if(err.name === 'UnauthorizedError'){
	res.status(401).send('401: Need Authorization');
	//res.status(500).send('500: Server error');
}*/
})



module.exports = app;


