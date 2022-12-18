const cryptoJS = require('crypto-js');
const salt = require('../config').key;

class StringUtils {
	static getHash(string) {
		return cryptoJS.AES.encrypt(string, salt).toString();
	}

	static getStringFromHash(hash) {
		return cryptoJS.AES
			.decrypt(hash, salt)
			.toString(cryptoJS.enc.Utf8);
	}
}

module.exports = StringUtils;