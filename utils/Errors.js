class ApplicationError extends Error {

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
