class BaseController {

	/**
	 * All required model entities
	 * @type {Object}
	 * @protected
	 */
	_entities;

	/**
	 * Model to be managed
	 * @type {Model}
	 * @protected
	 */
	_model;
	
	constructor() {
		this._entities = require('../models/entities');
		this._model = require('../models/Model');
	}
}

module.exports = BaseController;