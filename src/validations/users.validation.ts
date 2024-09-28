import Joi from "joi";

const usernameSchema = Joi.string().trim().alphanum().min(3).max(30).messages({
	"string.min": "{{#label}} must be at least 3 characters long",
	"string.max": "{{#label}} must not exceed 30 characters",
	"string.alphanum":
		"Requires the {{#label}} value to only contain a-z, A-Z, and 0-9",
});

const stringSchema = Joi.string()
	.trim()
	.min(2)
	.max(50)
	.pattern(/^[A-Za-z]+$/)
	.messages({
		"string.min": "{{#label}} must be at least 2 characters long",
		"string.max": "{{#label}} must not exceed 50 characters",
		"string.pattern.base": "{{#label}} should contain only letters",
	});

const emailSchema = Joi.string().email().messages({
	"string.email": "Invalid {{#label}} format",
});

const passwordSchema = Joi.string()
	.min(6)
	.pattern(/^(?=.*[a-z])(?=.*[\d\s\W]).{6,50}$/)
	.messages({
		"string.min": "{{#label}} must be at least 6 characters long",
		"string.pattern.base":
			"{{#label}} must contain at least one lowercase letter, one digit, and consist of at least 6 characters",
	});

export const createUserSchema = Joi.object({
	username: usernameSchema.required().messages({
		"string.empty": "{{#label}} is required",
	}),
	firstName: stringSchema.required().messages({
		"string.empty": "{{#label}} is required",
	}),
	lastName: stringSchema.required().messages({
		"string.empty": "{{#label}} is required",
	}),
	email: emailSchema.required().messages({
		"string.empty": "{{#label}} is required",
	}),
	password: passwordSchema.required().messages({
		"string.empty": "{{#label}} is required",
	}),
});

export const authUserSchema = Joi.object({
	email: emailSchema.required().messages({
		"string.empty": "{{#label}} is required",
	}),
	password: Joi.string().required().messages({
		"string.empty": "{{#label}} is required",
	}),
});

export const updateUserSchema = Joi.object({
	username: usernameSchema.optional(),
	firstName: stringSchema.optional(),
	lastName: stringSchema.optional(),
	email: emailSchema.optional(),
	password: passwordSchema.optional(),
}).min(1);

export const logoutUserSchema = Joi.object({
	logoutAllDevices: Joi.boolean().messages({
		"boolean.base": "{{#label}} must be a boolean value",
	}),
});
