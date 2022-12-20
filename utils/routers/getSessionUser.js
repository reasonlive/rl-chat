const jwt = require('jsonwebtoken');
const cfg = require('../config');
async function getSessionUserInfo(req,cookie){
	let cke;
	if(!cookie){

		cke = (req && req.session && req.session.t) ? req.session.t : '';
		if(!cke)return;
		let body = await jwt.verify(cke, cfg.jwtKey);
		return body;
	}
	else{
		cke = cookie;
		let body = await jwt.verify(cke, cfg.jwtKey);
		return body;
	}	
}

module.exports = getSessionUserInfo;