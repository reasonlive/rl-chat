const StringUtils = require('../utils/StringUtils');

class Model {

	#mongooseModel;
	static #connector;

	constructor(mongooseModel) {
		this.#mongooseModel = mongooseModel;
		if (!Model.#connector) {
			Model.#connector = require('../utils/db');			
		}
	}

	static getObject(entity) {
		return new this(entity);
	}

	/**
	 * Create model instance
	 * @param {Object} fields - Model fields
	 * @returns {ObjectId} id of the model entity
	 */
	async add(fields) {
		const {_id} = await this.#mongooseModel.create(fields);
		return _id;
	}

	async delete(id) {
		const {deletedCount} = await this.#mongooseModel.deleteOne({_id: id});
		return deletedCount;
	}

	async deleteAll(condition = null) {
		const {deletedCount} = await this.#mongooseModel.deleteMany(condition || {});
		return deletedCount;
	}

	async get(param) {
		let result;
		if (param instanceof require('../config').idType) {
			result = await this.#mongooseModel.findById(param).lean().exec();	
		} else if (typeof param === 'object') {
			result = await this.#mongooseModel.find(param).lean().exec();
			
			if(result.length > 1) {
				throw new Error('Duplicate error');
			}

		} else {
			console.log(param)
			result = null;
		}

		return Array.isArray(result)
			? result[0] || null
			: result;
	}

	async getAll(params = null) {
		if (params && typeof params === 'object') {
			return await this.#mongooseModel.find(params).exec();
		}

		return await this.#mongooseModel.find({});
	}

	async getId(params) {
		const {_id} = await this.get(params);
		return _id;
	}

	async update(id, fields) {
		return await this.#mongooseModel.findByIdAndUpdate(
			id,
			fields,
			{new: true, upsert: true, rawResult: true}
		);
	}

	async updateAll(condition, fields) {
		return await this.#mongooseModel.updateMany(
			condition,
			fields,
			{new: true, upsert: true, rawResult: true}
		);
	}

	async count(key = null, value = null) {
		if (!key) {
			return await this.#mongooseModel.estimatedDocumentCount();
		} else if (key && !value) {
			return await this.#mongooseModel.countDocument({_id: key});
		} else {
			return await this.#mongooseModel.countDocument({[key]: value});
		}
	}

	async getReferenceObject(id, mongooseModel) {
		const object = await mongooseModel.findById(id).lean().exec();
		return object;
	}

	encodeValue(value) {
		return StringUtils.getHash(value);
	}

	decodeValue(value) {
		return StringUtils.getStringFromHash(value);
	}
}

module.exports = Model;