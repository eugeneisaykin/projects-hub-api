import Joi from "joi";

export const statusSchema = Joi.object({
	name: Joi.string().min(3).max(30).required().messages({
		"string.empty": "Name is required",
		"string.min": "Name must be at least 3 characters long",
		"string.max": "Name must not exceed 30 characters",
	}),
	description: Joi.string().min(3).max(50).messages({
		"string.min": "Description must be at least 3 character long",
		"string.max": "Description must not exceed 50 characters",
	}),
});
