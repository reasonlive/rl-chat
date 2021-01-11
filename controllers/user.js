const Model = require('../models/user');
const crypt = require('crypto-js');



//@argument {Object} fields are name,email,password,country,age 
async function addUser(fields){
	console.log(fields)
	try{
		let count = await Model.countDocuments({name: fields.name});
		if(count > 0)return {error:true,name:'Register Error',message:'Name duplicate'};
		count = await Model.countDocuments({email: fields.email});
		if(count > 0)return {error:true,name:'Register Error',message:'Email duplicate'};
		
		const user = new Model(fields);
		user.set('pass', fields.password);
		const res = await user.save();
		return res;
	}catch(error){
		return{
			error: true,
			name: error.name,
			message: error.message
		}
	}
}

async function loginUser(email,password){

	const count = await Model.countDocuments({email:email});
	
	if(count < 1)return null;

	const user = await Model.findOne({email:email});
	
	if(!user.checkPassword(password)){
		return new Error('Invalid Password');
	}

	return user;
	
}


async function getUser(fields){
	

	const count = await Model.countDocuments(fields);
	if(count < 1)return null;

	const doc = await Model.findOne(fields);
	return doc;
}

async function getUserIp(id){
	const count = await Model.countDocuments({_id:id});
	if(count < 1)return null;

	const doc = await Model.find({_id:id}).select({lastIpLog});
	return doc;
}

async function findByIp(ip){
	const count = await Model.countDocuments({'lastIpLog.ip': ip});
	if(count < 1)return null;

	const doc = await Model.findOne({'lastIpLog.ip': ip});
	return doc;
}


async function removeUser(id){
	const count = await Model.countDocuments({_id:id});
	if(count < 1)return false;

	return await Model.deleteOne({_id:id});
}

async function updateUser(id, fields){

	const count = await Model.countDocuments({_id:id});
	if(count === 0)return null;

	if(fields.age)return new Error('Age is unchangable!');
	if(fields.email)return new Error('Email is unchangable!');

	const result = await Model.findOneAndUpdate({_id: id}, fields, 
	{
		new: true,
	  upsert: true,
	  rawResult: true 
	});

	return result;
}
//@argument {Object} data must be an Object {name:String,array:[]}
async function updateArray(id, data, set){

	let {name,array} = data,updated;

	try{


		const count = await Model.countDocuments({_id:id});
		if(count < 1)return null;

		let values;
		if(set)values = { $set: {[name]: array }};
		else values = { $push : {[name]: array }};

		updated = await Model.findOneAndUpdate({_id:id}, values,
		{
			new: true,
		  upsert: true,
		  rawResult: true 
		});
	}catch(e){
		return new Error(e.name+'/'+e.message);
	}
	return updated;


}

async function updateAllUsers(fields){
	

	const result = await Model.updateMany({}, {$set: fields}, 
	{
		new: true,
	  upsert: true,
	  rawResult: true 
	});

	return result;
}

async function banUser({id, time, forever}){

	const count = await Model.countDocuments({_id:id});
	if(count < 1)return false;

	return await Model.updateOne({_id:id}, 
	{
		 'ban.banned' : true,
		 'ban.expires': time || 86400000,
		  'ban.forever': forever || false,
		  'ban.dateOfApply': Date.now(),
	});
}

async function changePassword(id, newPassword){

	const count = await Model.countDocuments({_id:id});
	if(count < 1)return false;

	const user = await Model.findOne({_id:id});
	if(!user) return null;
	try{
		user.set('pass', newPassword);
		await user.save();
	}catch(e){
		return e;
	}
	return true;

}

/*async function getAllUsers(){
	return await Model.find().where({online:true});
}*/

async function getAllUsers({amount,online,banned,names,ids,admin,all}){
	if(amount){
		let arr = await Model.find({});
		return arr.length;
	}
	if(online){
		return await Model.find().where({online:true});
	}
	if(banned){
		return await Model.find().where({'ban.banned':true});
	}
	if(names){
		return await Model.find().select({name:true})
	}
	if(ids){
		return await Model.find().select({_id:true});
	}
	if(admin){
		return await Model.find().where({admin:true});
	}
	if(all){
		return await Model.find();
	}
}

//require('../custom/db');






module.exports = {
	addUser,
	loginUser,
	getUser,
	getUserIp,
	findByIp,
	removeUser,
	updateUser,
	updateArray,
	updateAllUsers,
	getAllUsers,
	banUser,
	changePassword
}





/*function checkPassword(pass, hash){
	const salt = require('../lib/config').key;
	
	let decr = crypt.AES.decrypt(hash, salt);
	let original = decr.toString(crypt.enc.Utf8);

	return original === pass;
}
*/











