const Model = require('./Model');
const crypt = require('crypto-js');

class User extends Model {

	#jwt = {
		...require('jsonwebtoken'),
		key: require('../config').jwtKey
	};

	getStatusList() {
		return [
			'newbie',
			'calm',
			'provocative',
			'heckler',
			'smartass',
			'asshole',
			'prettyboy',
		  'oldfashion',
		  'advanced',
		  'finefellow'
		];
	}

	async getSessionUserInfo(req, cookie = null) {
		let token;
		if (!cookie) {
			token = req?.session?.t || null;
			
			if (!token) {
				return;
			}
			
		} else {
			token = cookie;
		}

		return await this.#jwt.verify(token, this.#jwt.key);	
	}

	async getSessionUserToken(id, name) {
		const payload = {
			id,
			name,
			exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
		}

		return this.#jwt.sign(payload, cfg.jwtKey);
	}

	/*function checkPassword(pass, hash){
		const salt = require('../lib/config').key;
		
		let decr = crypt.AES.decrypt(hash, salt);
		let original = decr.toString(crypt.enc.Utf8);

		return original === pass;
	}*/
}

module.exports = User;