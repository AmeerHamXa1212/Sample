"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config/config");
const mongoose_1 = __importDefault(require("mongoose"));
const port = config_1.appConfig.port;
console.log(port);
mongoose_1.default.set("strictQuery", true);
const server = app_1.default.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
