import Joi from "joi";

const stringSchema = Joi.string()
	.trim()
	.min(2)
	.max(30)
	.pattern(/^[A-Za-z]+$/)
	.messages({
		"string.min": "{{#label}} must be at least 2 characters long",
		"string.max": "{{#label}} must not exceed 30 characters",
		"string.pattern.base": "{{#label}} should contain only letters",
	});

export const createStatusSchema = Joi.object({
	name: stringSchema.required().messages({
		"string.empty": "{{#label}} is required",
	}),
	description: stringSchema.optional(),
});

export const updateStatusSchema = Joi.object({
	name: stringSchema.optional(),
	description: stringSchema.optional(),
}).min(1);
