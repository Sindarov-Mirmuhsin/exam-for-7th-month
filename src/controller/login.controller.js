import { sign } from '../utils/jwt.utils.js';
import { read } from '../utils/fs.utils.js';
import { errorHandler } from '../exseptions/errorHandle.js';
import { loginValidation } from '../validation/validation.js';

export const LOGIN = async (req, res, next) => {
	const { error, value } = loginValidation.validate(req.body);

	if (error) {
		return next(new errorHandler(error.message, 400));
	}

	const { username, password } = value;

	const allUsers = await read('users.model.json').catch((err) =>
		next(new errorHandler(err.message, 500)),
	);

	const foundUser = allUsers.find(
		(e) => e.username == username && e.password == password,
	);

	if (!foundUser) {
		return next(new errorHandler('This user not found!', 404));
	}

	return res.json({
		message: 'successful',
		token: sign({ id: foundUser?.id }),
	});
};
