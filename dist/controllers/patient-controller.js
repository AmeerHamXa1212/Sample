"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePatient = exports.updatePatient = exports.createPatient = exports.getAllPatient = void 0;
const patient_1 = __importDefault(require("../models/patient")); // Import the model
const getAllPatient = async (_req, res, _next) => {
    try {
        const patients = await patient_1.default.find();
        res.json(patients);
        console.log("Patients Fetched from DB");
    }
    catch (error) {
        _next({ statusCode: 500, message: 'Internal server error' });
    }
};
exports.getAllPatient = getAllPatient;
const createPatient = async (_req, res, _next) => {
    try {
        const newPatient = await patient_1.default.create(_req.body);
        res.status(201).send(newPatient);
        console.log("New Patient Added");
    }
    catch (error) {
        _next({ statusCode: 400, message: error.message });
    }
};
exports.createPatient = createPatient;
const updatePatient = async (_req, _res, _next) => {
    try {
        const updatedPatient = await patient_1.default.updateOne({ _id: _req.params.patientId }, { $set: _req.body });
        if (!updatedPatient) {
            _next({ statusCode: 404, message: 'Patient not found' });
            return;
        }
        _res.send(updatedPatient);
        console.log(`Patient with id ${_req.params.patientId} updated from DB`);
    }
    catch (error) {
        _next({ statusCode: 500, message: 'Internal server error' });
    }
};
exports.updatePatient = updatePatient;
const deletePatient = async (_req, _res, _next) => {
    try {
        console.log('Patient ID:', _req.params.patientId);
        const deletedPatient = await patient_1.default.findByIdAndDelete(_req.params.patientId);
        if (!deletedPatient) {
            _next({ statusCode: 404, message: 'Patient not found' });
            return;
        }
        _res.json({ message: 'Patient deleted successfully' });
        console.log(`Patient with id ${_req.params.patientId} Deleted from DB`);
    }
    catch (error) {
        _next({ statusCode: 500, message: 'Internal server error' });
    }
};
exports.deletePatient = deletePatient;
