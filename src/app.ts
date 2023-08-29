import express from "express";
import { appConfig } from "./config/config";
import routes from "./routes/index";
import * as mongoose from "mongoose";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(routes);
app.use(errorHandler);

mongoose
  .connect(appConfig.databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions)
  .then(() => console.log("DataBase connection successful"))
  .catch((err) =>
    console.error(`Database connection failed due to error ${err}`)
  )
  .finally(() => console.log("This is finally block of code"));

export default app;
