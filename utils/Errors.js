class ApplicationError extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}

class DatabaseRequestError extends ApplicationError {

} 

class ClientRequestError extends ApplicationError {

}

class InternalError extends ApplicationError {

}

module.exports = {
	DatabaseRequestError,
	ClientRequestError,
	InternalError
}
