import Joi from 'joi';

export const loginValidation = Joi.object()
	.keys({
		username: Joi.string().min(5).max(20).required(),
		password: Joi.string().min(8).max(20).required(),
	})
	.required();

export const categoryValidation = Joi.object()
	.keys({
		category_name: Joi.string().min(3).required(),
	})
	.required();

export const subCategoryValidation = Joi.object()
	.keys({
		category_id: Joi.number().min(1).required(),
		sub_category_name: Joi.string().min(3).required(),
	})
	.required();

export const productValidation = Joi.object().keys({
	sub_category_id: Joi.number().min(1).required(),
	model: Joi.string().min(3).required(),
	product_name: Joi.string().min(3).required(),
	color: Joi.string().min(3).required(),
	price: Joi.number().min(1).required(),
}).required();
