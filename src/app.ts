import express from 'express';
import { appConfig } from './config/config'
import routes from './routes';

const app = express();

app.use(express.json());
app.use(routes);

export default app;
