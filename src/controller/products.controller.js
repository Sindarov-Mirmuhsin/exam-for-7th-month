import { errorHandler } from '../exseptions/errorHandle.js';
import { read, write } from '../utils/fs.utils.js';
import { productValidation } from '../validation/validation.js';

export const queryProduct = async (req, res, next) => {
	const { sub_category_id, model, product_name, color, price } = req.query;

	const allProducts = await read('products.model.json').catch((err) =>
		next(new errorHandler(err.message, 500)),
	);

	const queryFiltered = allProducts.filter(
		(e) =>
			(e.color == color && e.price == price) ||
			(e.color == color && e.model == model) ||
			(e.color == color && e.product_name == product_name) ||
			(e.color == color && e.sub_category_id == sub_category_id) ||
			(e.price == price && e.model == model) ||
			(e.price == price && e.product_name == product_name) ||
			(e.price == price && e.sub_category_id == sub_category_id) ||
			(e.product_name == product_name && e.model == model) ||
			(e.sub_category_id == sub_category_id && e.model == model) ||
			(e.sub_category_id == sub_category_id && e.product_name == product_name),
	);

	return res.status(200).json({
		queryFiltered,
	});
};

export const byIdProducts = async (req, res, next) => {
	const { product_id } = req.params;
	const allProducts = await read('products.model.json').catch((err) =>
		next(new errorHandler(err.message, 500)),
	);
	const foundProduct = allProducts.find((e) => e.product_id == product_id);
	if (!foundProduct) {
		return next(new errorHandler('Product not found!!!', 404));
	}
	res.json({
		foundProduct,
	});
};

export const product = async (_, res, next) => {
	return next(
		res.status(400).json({
			message: [],
		}),
	);
};

export const postProducts = async (req, res, next) => {
	const { error, value } = productValidation.validate(req.body);

	if (error) {
		return next(new errorHandler(error.message, 400));
	}
	const { sub_category_id, model, product_name, color, price } = value;

	const allProducts = await read('products.model.json').catch((err) =>
		next(new errorHandler(err.message, 500)),
	);

	const foundProduct = allProducts.find(
		(e) =>
			e.sub_category_id == sub_category_id &&
			e.product_name == product_name &&
			e.model == model &&
			e.color == color &&
			e.price == price,
	);

	if (foundProduct) {
		return next(new errorHandler('There is this product'));
	}

	allProducts.push({
		product_id: allProducts.at(-1)?.product_id + 1 || 1,
		sub_category_id,
		product_name,
		model,
		color,
		price,
	});

	const newProduct = await write('products.model.json', allProducts).catch(
		(err) => next(new errorHandler(err.message, 500)),
	);

	if (newProduct) {
		res.json({
			message: 'Product created',
		});
	}
};

export const editProduct = async (req, res, next) => {
	const { product_id } = req.params;
	const { error, value } = productValidation.validate(req.body);
	if (error) {
		return next(new errorHandler(error.message, 400));
	}
	const { sub_category_id, model, product_name, color, price } = value;
	const allProducts = await read('products.model.json').catch((err) =>
		next(new errorHandler(err.message, 500)),
	);
	const foundProduct = allProducts.find((e) => e.product_id == product_id);
	if (!foundProduct) {
		return next(new errorHandler('Product not found', 404));
	}
	foundProduct.sub_category_id =
		sub_category_id || foundProduct.sub_category_id;
	foundProduct.product_name = product_name || foundProduct.product_name;
	foundProduct.model = model || foundProduct.model;
	foundProduct.color = color || foundProduct.color;
	foundProduct.price = price || foundProduct.price;

	const editProduct = await write('products.model.json', allProducts).catch(
		(err) => next(new errorHandler(err.message, 500)),
	);

	if (editProduct) {
		res.json({
			message: 'Product edited',
		});
	}
};

export const deleteProduct = async (req, res, next) => {
	const { product_id } = req.params;

	const allProducts = await read('products.model.json').catch((err) =>
		next(new errorHandler(err.message, 500)),
	);
	const foundProduct = allProducts.find((e) => e.product_id == product_id);
	if (!foundProduct) {
		return next(new errorHandler('Product not found', 404));
	}

	const index = allProducts.findIndex((e) => e.product_id == product_id);

	allProducts.splice(index, 1);

	const deletedProduct = await write('products.model.json', allProducts);

	if (deletedProduct) {
		res.json({
			message: 'Product deleted',
		});
	}
};
