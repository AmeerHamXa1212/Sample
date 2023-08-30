import express from "express";
import { appConfig } from "./config/config";
import routes from "./routes/index";
import * as mongoose from "mongoose";
import * as dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
dotenv.config();

const databaseURL =
  process.env.dbUrl ||
  "mongodb+srv://ameerhamza:ameerhamza11@cluster0.e99r2go.mongodb.net/";
const port = process.env.port || 5500;

app.use(express.json());
app.use(routes);
app.use(errorHandler);

mongoose
  .connect(databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions)
  .then(() => console.log("DataBase connection successful"))
  .catch((err) =>
    console.error(`Database connection failed due to error ${err}`)
  )
  .finally(() => console.log("This is finally block of code"));

export default app;
