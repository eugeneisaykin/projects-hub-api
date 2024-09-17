import Joi from "joi";

export const userSchema = Joi.object({
	username: Joi.string().min(3).max(30).required().messages({
		"string.empty": "Username is required",
		"string.min": "Username must be at least 3 characters long",
		"string.max": "Username must not exceed 30 characters",
	}),
	firstName: Joi.string().min(2).max(50).required().messages({
		"string.empty": "First name is required",
		"string.min": "First name must be at least 1 character long",
		"string.max": "First name must not exceed 50 characters",
	}),
	lastName: Joi.string().min(2).max(50).required().messages({
		"string.empty": "Last name is required",
		"string.min": "Last name must be at least 1 character long",
		"string.max": "Last name must not exceed 50 characters",
	}),
	email: Joi.string().email().required().messages({
		"string.empty": "Email is required",
		"string.email": "Invalid email format",
	}),
	password: Joi.string()
		.min(6)
		.pattern(/^(?=.*[a-z])(?=.*[\d\s\W]).{6,50}$/)
		.required()
		.messages({
			"string.empty": "Password is required",
			"string.min": "Password must be at least 6 characters long",
			"string.pattern.base":
				"The password must contain at least one lowercase letter, one digit and consist of at least 6 characters",
		}),
});
