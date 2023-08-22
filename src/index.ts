import app from './app';
import { appConfig } from './config/config';
import mongoose from 'mongoose';

const port = appConfig.port;
mongoose.set('strictQuery', true);

//console.log(`This is my database url : ${appConfig.databaseURL}`)

const server = app.listen(port, () => {
    //console.log(`This is my database url : ${appConfig.databaseURL}`)
  console.log(`Server is running at http://localhost:${port}`);
});
