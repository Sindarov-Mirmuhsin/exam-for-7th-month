import express from 'express';
const PORT = process.env.PORT || 5050;
import dotenv from 'dotenv';
import { ErrorHandler } from './middlewares/ErrorHandler.middleware.js';
import routes from './routes/routes.js';
dotenv.config();

const app = express();

app.use(express.json());
app.use(routes);
app.use(ErrorHandler);

app.all('/*', (_, res) => res.sendStatus(404));

app.listen(PORT, console.log(PORT));
