import path from 'path';
import fs from 'fs';

export const read = (dir) => {
	return new Promise((resolve, reject) => {
		fs.readFile(path.join(process.cwd(), 'src', 'model', dir), (err, data) => {
			if (err) reject(err);

			if (!data) {
				return reject('Data is not Found');
			}

			resolve(JSON.parse(data));
		});
	});
};

export const write = (dir, data) => {
	return new Promise((resolve, reject) => {
		if (!fs.existsSync(path.join(process.cwd(), 'src', 'model', dir))) {
			return reject(new Error("Path doesn't exists"));
		}

		fs.writeFile(
			path.join(process.cwd(), 'src', 'model', dir),
			JSON.stringify(data, null, 4),
			(err) => {
				if (err) reject(err);

				resolve(data.at(-1));
			},
		);
	});
};
