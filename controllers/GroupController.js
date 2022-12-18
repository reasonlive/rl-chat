
const BaseController = require('./BaseController');

class GroupController extends BaseController {
	//////////////////////////////////////
	//METHODS FOR GROUP CONTROLLER
	constructor() {
		super();
		this.model = this._model.getObject(this._entities.group);
		return this;
	}
}

module.exports = GroupController;