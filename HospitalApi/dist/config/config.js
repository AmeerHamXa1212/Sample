"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
exports.appConfig = {
    port: parseInt(process.env.PORT || '5500', 10),
    databaseURL: "mongodb://127.0.0.1:27017/HospitalApi-",
};
