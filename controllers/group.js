
const Model = require('../models/group');

async function addGroup(name, age, country, email){

	try{
		const count = await Model.countDocuments({name: name, email: email});
		if(count > 0)return false;

		const group = new Model({name, age, country, email});
		const res = await group.save();
		return res;
	}catch(error){
		return{
			error: true,
			name: error.name,
			message: error.message
		}
	}
}

async function getGroup(options){
	try{
		const count = await Model.countDocuments(options);
		if(count < 1)return null;

		const doc = await Model.findOne(options);
		return doc;
	}catch(e){
		return new Error(e.name+'/'+e.message);
	}
	
}


async function removeGroup(id){
	const count = await Model.countDocuments({id:id});
	if(count < 1)return false;

	return await Model.deleteOne({id:id});
}

async function updateGroup(id, values){

	const count = await Model.countDocuments({id:id});
	if(count === 0)return null;

	const result = await Model.findOneAndUpdate({id: id}, values, 
	{
		new: true,
	  upsert: true,
	  rawResult: true 
	});

	return result;

}

async function updateAllGroups(values){
	

	const result = await Model.updateMany({}, {$set: values}, 
	{
		new: true,
	  upsert: true,
	  rawResult: true 
	});

	return result;
}

async function banGroup(id, time, forever){

	const count = await Model.countDocuments({id:id});
	if(count < 1)return false;

	return await Model.updateOne({id:id}, 
	{
		 ban: true
	});
}

async function getAllGroups(){	
	try{
		const all = await Model.find();
		return all;
	}catch(e){
		return new Error(e.name+'/'+e.message);
	}
	
}


module.exports = {
	addGroup,
	getGroup,
	removeGroup,
	updateGroup,
	updateAllGroups,
	getAllGroups,
	banGroup,
}