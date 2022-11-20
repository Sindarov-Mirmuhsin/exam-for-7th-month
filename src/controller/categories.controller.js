import { errorHandler } from '../exseptions/errorHandle.js';
import { read, write } from '../utils/fs.utils.js';
import { categoryValidation } from '../validation/validation.js';

export const getCategoryQuery = async (req, res, next) => {
	const allCategories = await read('categories.model.json').catch((err) =>
		next(new errorHandler(err.message, 500)),
	);

	const allSubCategories = await read('subCategories.model.json').catch((err) =>
		next(new errorHandler(err.message, 500)),
	);

	const queryFiltered = [];

	for (let i of allCategories) {
		queryFiltered.push({
			category_id: i.category_id,
			category_name: i.category_name,
			allSubCategories: allSubCategories.filter((e) => {
				return e.category_id == i.category_id && delete e.category_id;
			}),
		});
	}
	res.json(queryFiltered);
};

export const getCategoryById = async (req, res, next) => {
	const { id } = req.params;

	const allCategories = await read('categories.model.json').catch((err) =>
		next(new errorHandler(err.message, 500)),
	);

	const allSubCategories = await read('subCategories.model.json').catch((err) =>
		next(new errorHandler(err.message, 500)),
	);

	const foundCategory = allCategories.find((e) => e.category_id == id);

	res.json(foundCategory);
};

export const postCategory = async (req, res, next) => {
	const { error, value } = categoryValidation.validate(req.body);

	if (error) {
		return next(new errorHandler(error.message, 400));
	}

	const { category_name } = value;

	const allCategories = await read('categories.model.json').catch((err) =>
		next(new errorHandler(err.message, 500)),
	);

	const foundCategory = allCategories.find(
		(e) => e.category_name == category_name,
	);

	if (foundCategory) {
		return next(new errorHandler('There is this category'));
	}

	allCategories.push({
		category_id: allCategories.at(-1)?.category_id + 1 || 1,
		category_name,
	});

	const newCategory = await write('categories.model.json', allCategories).catch(
		(err) => next(new errorHandler(err.message, 500)),
	);

	if (newCategory) {
		res.json({
			message: 'Category created',
		});
	}
};

export const editCategory = async (req, res, next) => {
	const { category_id } = req.params;
	const { error, value } = categoryValidation.validate(req.body);
	if (error) {
		return next(new errorHandler(error.message, 400));
	}
	const { category_name } = value;
	const allCategories = await read('categories.model.json').catch((err) =>
		next(new errorHandler(err.message, 500)),
	);
	const foundCategory = allCategories.find((e) => e.category_id == category_id);
	if (!foundCategory) {
		return next(new errorHandler('Category not found', 404));
	}
	foundCategory.category_name = category_name || foundCategory.category_name;

	const editCategory = await write(
		'categories.model.json',
		allCategories,
	).catch((err) => next(new errorHandler(err.message, 500)));

	if (editCategory) {
		res.json({
			message: 'Category edited',
		});
	}
};

export const deletecategory = async (req, res, next) => {
	const { category_id } = req.params;

	const allCategories = await read('categories.model.json').catch((err) =>
		next(new errorHandler(err.message, 500)),
	);
	const foundCategory = allCategories.find((e) => e.category_id == category_id);
	if (!foundCategory) {
		return next(new errorHandler('Category not found', 404));
	}

	const index = allCategories.findIndex((e) => e.category_id == category_id);

	allCategories.splice(index, 1);

	const deletedCategory = await write('categories.model.json', allCategories);

	if (deletedCategory) {
		res.json({
			message: 'Category deleted',
		});
	}
};
