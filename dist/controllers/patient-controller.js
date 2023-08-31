"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePatient = exports.updatePatient = exports.createPatient = exports.getAllPatient = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const patient_1 = require("../models/patient");
const patient_2 = __importDefault(require("../models/patient"));
const mongoose_1 = __importDefault(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const patientSchema = joi_1.default.object({
    petName: joi_1.default.string().min(4).max(10).required(),
    petType: joi_1.default.string()
        .valid(...Object.values(patient_1.EPetType))
        .required(),
    ownerName: joi_1.default.string().required(),
    ownerAddress: joi_1.default.string().required(),
    ownerPhone: joi_1.default.string().required(),
});
const generateErrorResponse = (statusCode, message) => {
    return { statusCode, message };
};
const checkNullAndEmpty = (value, errorMessage) => {
    if (value === null || value.length === 0) {
        throw generateErrorResponse(404, errorMessage);
    }
};
exports.getAllPatient = (0, express_async_handler_1.default)(async (req, res, next) => {
    const patients = await patient_2.default.find();
    checkNullAndEmpty(patients, "No Patient in DB");
    res.status(200).json(patients);
});
exports.createPatient = (0, express_async_handler_1.default)(async (req, res, next) => {
    const newPatient = await patient_2.default.create(req.body);
    if (!newPatient.petName ||
        !newPatient.ownerName ||
        !newPatient.ownerPhone ||
        !newPatient.ownerAddress ||
        !newPatient.petType) {
        return next(generateErrorResponse(400, "Bad Request"));
    }
    res.status(201).send(newPatient);
});
exports.updatePatient = (0, express_async_handler_1.default)(async (req, res, next) => {
    const patientId = req.params.patientId;
    if (!mongoose_1.default.Types.ObjectId.isValid(patientId)) {
        return next(generateErrorResponse(400, "Invalid ObjectId format"));
    }
    const updatedPatient = await patient_2.default.findByIdAndUpdate(patientId, { $set: req.body }, { new: true });
    checkNullAndEmpty(updatedPatient, "Patient not found");
    res.status(200).json(updatedPatient);
});
exports.deletePatient = (0, express_async_handler_1.default)(async (req, res, next) => {
    const patientId = req.params.patientId;
    if (!mongoose_1.default.Types.ObjectId.isValid(patientId)) {
        return next(generateErrorResponse(400, "Invalid ObjectId format"));
    }
    const deletedPatient = await patient_2.default.findByIdAndDelete(req.params.patientId);
    checkNullAndEmpty(deletedPatient, "Patient not found");
    res.status(200).json({ message: "Patient deleted successfully" });
});
