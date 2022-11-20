import { errorHandler } from '../exseptions/errorHandle.js';
import { read, write } from '../utils/fs.utils.js';
import { subCategoryValidation } from '../validation/validation.js';

export const getSubCategoryQuery = async (req, res, next) => {
	const allSubCategories = await read('subCategories.model.json').catch((err) =>
		next(new errorHandler(err.message, 500)),
	);

	const allProducts = await read('products.model.json').catch((err) =>
		next(new errorHandler(err.message, 500)),
	);

	const queryFiltered = [];

	for (let i of allSubCategories) {
		queryFiltered.push({
			category_id: i.category_id,
			category_name: i.category_name,
			allProducts: allProducts.filter((e) => {
				return e.sub_category_id == i.category_id;
			}),
		});
	}
	res.json(queryFiltered);
};

export const getSubCategoryById = async (req, res, next) => {
	const { id } = req.params;

	const SubCategories = await read('subCategories.model.json').catch((err) =>
		next(new errorHandler(err.message, 500)),
	);

	const foundSubCategory = SubCategories.find((e) => e.category_id == id);

	res.json(foundSubCategory);
};

export const postSubCategory = async (req, res, next) => {
	const { error, value } = subCategoryValidation.validate(req.body);

	if (error) {
		return next(new errorHandler(error.message, 400));
	}

	const { category_id, sub_category_name } = value;

	const SubCategories = await read('subCategories.model.json').catch((err) =>
		next(new errorHandler(err.message, 500)),
	);

	const foundSubCategory = SubCategories.find(
		(e) =>
			e.category_id == category_id && e.sub_category_name == sub_category_name,
	);

	if (foundSubCategory) {
		return next(new errorHandler('There is this subCategory'));
	}

	SubCategories.push({
		sub_category_id: SubCategories.at(-1)?.sub_category_id + 1 || 1,
		category_id,
		sub_category_name,
	});

	const newSubCategory = await write(
		'subCategories.model.json',
		SubCategories,
	).catch((err) => next(new errorHandler(err.message, 500)));

	if (newSubCategory) {
		res.json({
			message: 'SubCategory created',
		});
	}
};

export const editSubCategory = async (req, res, next) => {
	const { sub_category_id } = req.params;
	const { error, value } = subCategoryValidation.validate(req.body);

	if (error) {
		return next(new errorHandler(error.message, 400));
	}
	const { category_id, sub_category_name } = value;
	const SubCategories = await read('subCategories.model.json').catch((err) =>
		next(new errorHandler(err.message, 500)),
	);
	const foundSubCategory = SubCategories.find(
		(e) => e.sub_category_id == sub_category_id,
	);
	if (!foundSubCategory) {
		return next(new errorHandler('subCategory not found', 404));
	}
	foundSubCategory.category_id = category_id || foundSubCategory.category_id;
	foundSubCategory.sub_category_name =
		sub_category_name || foundSubCategory.sub_category_name;

	const editedSubCategory = await write(
		'subCategories.model.json',
		SubCategories,
	).catch((err) => next(new errorHandler(err.message, 500)));

	if (editedSubCategory) {
		res.json({
			message: 'SubCategory edited',
		});
	}
};

export const deleteSubCategory = async (req, res, next) => {
	const { sub_category_id } = req.params;

	const SubCategories = await read('subCategories.model.json').catch((err) =>
		next(new errorHandler(err.message, 500)),
	);
	const foundSubCategory = SubCategories.find(
		(e) => e.sub_category_id == sub_category_id,
	);
	if (!foundSubCategory) {
		return next(new errorHandler('SubCategory not found', 404));
	}

	const index = SubCategories.findIndex(
		(e) => e.sub_category_id == sub_category_id,
	);

	SubCategories.splice(index, 1);

	const deletedSubCategory = await write(
		'subCategories.model.json',
		SubCategories,
	);

	if (deletedSubCategory) {
		res.json({
			message: 'SubCategory deleted',
		});
	}
};
