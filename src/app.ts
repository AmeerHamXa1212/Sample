import express from 'express';
import { appConfig } from './config/config'
import routes from './routes/index';
import * as mongoose from 'mongoose'

const app = express();

app.use(express.json());
app.use(routes);

mongoose.connect('mongodb://127.0.0.1:27017/HospitalAPI-ahk', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions)
.then(() => console.log("DataBase connection successful"))
.catch((err) => console.error(`Database connection failed due to error ${err}`))
.finally(() => console.log("This is finally block of code"))

export default app;
