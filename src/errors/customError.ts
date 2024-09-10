export default class CustomError extends Error {
	public status: number;

	constructor(statusCode: number, message: string) {
		super(message);
		this.status = statusCode;
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}
