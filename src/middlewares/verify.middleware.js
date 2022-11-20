import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
	const { token } = req.headers;

	if (!token) {
		return res.status(401).json({
			message: 'Provide access token',
		});
	}

	jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
		if (err instanceof jwt.JsonWebTokenError) {
			return res.status(401).json({
				message: 'Invalid Token',
			});
		}

		return next();
	});
};
