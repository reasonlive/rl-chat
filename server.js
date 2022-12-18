const http = require('http');
const app = require('./app');
const cfg = require('./config');
const b64 = require('base-64');
const utf8 = require('utf8');

const WebSocketServer = require('ws').Server;


const Facade = require('./controllers');
const getSessionUserInfo = require('./utils/request/getSessionUser');



const server = http.createServer(app);

const ws = new WebSocketServer({server});

//all sockets connected to the chat
const sockets = new Set();




//when app has a socket connection between chat and server
//it takes session cookie , finds logged user and sends his messages to all
ws.on('connection',  async function(socket,req){

	sockets.add(socket);
	let userData = await getLoggedUserData(req);
	console.log(userData.name+" has connected to the chat");
	socket.on('message', function(msg){

		let receivedString = msg.split('/');
		
		//msgData which will be received on Chat page
		let msgData = {
			body:receivedString[0],
			creator:userData.name,
			time: getTime(),
			loggedUser: userData.name,
			avatar: userData.avatar,
			id:receivedString[1]
		}

		
		for(let sock of sockets){
			
			sock.send(JSON.stringify(msgData));
		}

		//socket.close();

	})

	socket.on('error',  function(err){
		console.log(err);
	})

	socket.on('close',  function(){
		//console.log(socket.username);
		sockets.delete(socket);
		
		
	})

})



server.listen(cfg.port.website, function(){
	console.log('app is on port :'+cfg.port.website+",\nstarted at: "+new Date());
	
})



function getTime(){
	let d = new Date(Date.now());
	return d.getHours()+":"+d.getMinutes();
}

function getSessionCookie(req){
	if(!req.headers.cookie)return null;
	let match = /express:sess=(.*);/.exec(req.headers.cookie);
	return match[1];
}

//takes cookie and decodes it to a user data
async function getLoggedUserData(req){
	let cookie = getSessionCookie(req);
	let result = b64.decode(cookie);
	result = utf8.decode(result);
	let token = JSON.parse(result);
	token = token.t;
	
	let user = await getSessionUserInfo(req,token);
	let userData = await Facade.getUserData(user.id);
	return userData;
}







