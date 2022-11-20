import { Router } from 'express';
import { LOGIN } from '../controller/login.controller.js';
import {
	getCategoryQuery,
	getCategoryById,
	postCategory,
	editCategory,
	deletecategory,
} from '../controller/categories.controller.js';
import {
	getSubCategoryQuery,
	getSubCategoryById,
	postSubCategory,
	editSubCategory,
	deleteSubCategory,
} from '../controller/subCategories.controller.js';
import {
	queryProduct,
	byIdProducts,
	product,
	postProducts,
	editProduct,
	deleteProduct,
} from '../controller/products.controller.js';
import { verifyToken } from '../middlewares/verify.middleware.js';
const router = Router();

export default router
	.post('/login', LOGIN)
	.use(verifyToken)
	.get('/categories/:id', getCategoryById)
	.get('/categories', getCategoryQuery)
	.post('/categories', postCategory)
	.put('/categories/:category_id', editCategory)
	.delete('/categories/:category_id', deletecategory)
	.get('/subcategories', getSubCategoryQuery)
	.get('/subcategories/:id', getSubCategoryById)
	.post('/subcategories', postSubCategory)
	.put('/subcategories/:sub_category_id', editSubCategory)
	.delete('/subcategories/:sub_category_id', deleteSubCategory)
	.get('/products', product)
	.get('/products', queryProduct)
	.get('/products/:product_id', byIdProducts)
	.post('/products', postProducts)
	.put('/products/:product_id', editProduct)
	.delete('/products/:product_id', deleteProduct);
