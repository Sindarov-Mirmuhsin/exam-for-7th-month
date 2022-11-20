import http from 'http';
export const ErrorHandler = (err, req, res, next) => {
	if (process.env.NODE_ENV == 'development') {
		return res.json({
			status: err.status,
			message: err.message,
		});
	}

	if (process.env.NODE_ENV == 'production') {
		return res.json({
			status: err.status,
			message: http.STATUS_CODES[err.status],
		});
	}
};
