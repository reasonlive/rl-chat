const StringUtils = require('../utils/StringUtils');

class Model {

	#mongoEntity;
	static #connector;

	constructor(mongoEntity) {
		this.#mongoEntity = mongoEntity;
		if (!Model.#connector) {
			Model.#connector = require('../utils/db');			
		}

		return this;
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
		const {_id} = await this.#mongoEntity.create(fields);
		return _id;
	}

	async delete(id) {
		const {deletedCount} = await this.#mongoEntity.deleteOne({_id: id});
		return deletedCount;
	}

	async deleteAll(condition = null) {
		const {deletedCount} = await this.#mongoEntity.deleteMany(condition || {});
		return deletedCount;
	}

	async get(param) {
		let result;
		if (param instanceof require('../config').idType) {
			result = await this.#mongoEntity.findById(param).lean().exec();	
		} else if (typeof param === 'object') {
			result = await this.#mongoEntity.find(param).lean().exec();
			
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
			return await this.#mongoEntity.find(params).exec();
		}

		return await this.#mongoEntity.find({});
	}

	async getId(params) {
		const {_id} = await this.get(params);
		return _id;
	}

	async update(id, fields) {
		return await this.#mongoEntity.findByIdAndUpdate(
			id,
			fields,
			{new: true, upsert: true, rawResult: true}
		);
	}

	async updateAll(condition, fields) {
		return await this.#mongoEntity.updateMany(
			condition,
			fields,
			{new: true, upsert: true, rawResult: true}
		);
	}

	async count(key = null, value = null) {
		if (!key) {
			return await this.#mongoEntity.estimatedDocumentCount();
		} else if (key && !value) {
			return await this.#mongoEntity.countDocument({_id: key});
		} else {
			return await this.#mongoEntity.countDocument({[key]: value});
		}
	}

	encodeValue(value) {
		return StringUtils.getHash(value);
	}

	decodeValue(value) {
		return StringUtils.getStringFromHash(value);
	}
}

module.exports = Model;