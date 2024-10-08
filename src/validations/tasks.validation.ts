import Joi from "joi";

const stringSchema = Joi.string()
	.trim()
	.min(2)
	.pattern(/^[A-Za-z]+$/)
	.messages({
		"string.min": "{{#label}} must be at least 2 characters long",
		"string.pattern.base": "{{#label}} should contain only letters",
	});

const dateSchema = Joi.date().iso().messages({
	"date.base": "{{#label}} must be a valid date",
});

const numberSchema = Joi.number()
	.integer()
	.positive()
	.allow(null)
	.optional()
	.messages({
		"number.base": "{{#label}} must be a valid number",
		"number.integer": "{{#label}} must be an integer",
		"number.positive": "{{#label}} must be a positive number",
	});

export const createTaskSchema = Joi.object({
	name: stringSchema.max(30).required().messages({
		"string.empty": "Task name is required",
		"string.max": "Task name must not exceed 30 characters",
	}),
	description: stringSchema.max(1000).optional().messages({
		"string.max": "Description must not exceed 1000 characters",
	}),
	startDate: dateSchema.required().messages({
		"any.required": "Start date is required",
	}),
	endDate: dateSchema
		.when("startDate", {
			is: Joi.date().required(),
			then: Joi.date().greater(Joi.ref("startDate")).allow(null),
		})
		.optional()
		.messages({
			"date.greater": "End date must be later than start date",
		}),
	priority: Joi.string()
		.valid("low", "medium", "high")
		.default("medium")
		.messages({
			"any.only": "Priority must be one of: low, medium, or high",
		}),
	statusId: numberSchema,
	assigneeId: numberSchema,
	reviewerId: numberSchema,
});
