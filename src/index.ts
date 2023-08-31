import app from "./app";
import { appConfig } from "./config/config";
import mongoose from "mongoose";

const port = appConfig.port;
console.log(port);
mongoose.set("strictQuery", true);
const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
