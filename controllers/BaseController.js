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
	
	constructor(model = require('../models/Model')) {
		this._entities = require('../models/entities');
		this._model = model;
	}
}

module.exports = BaseController;