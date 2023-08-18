"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePatient = exports.updatePatient = exports.createPatient = exports.getAllPatient = void 0;
const patient_1 = __importDefault(require("../models/patient"));
const getAllPatient = async (_req, res) => {
    console.log("getAllPatients");
    try {
        const patients = await patient_1.default.find();
        res.json(patients);
        console.log("Patients Fetched from DB");
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAllPatient = getAllPatient;
const createPatient = async (_req, res) => {
    try {
        const newPatient = await patient_1.default.create(_req.body);
        res.status(201).send(newPatient);
        console.log("New Patient Added");
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.createPatient = createPatient;
const updatePatient = async (_req, _res) => {
    try {
        const updatedPatient = await patient_1.default.updateOne({ _id: _req.params.patientId }, { $set: _req.body });
        if (!updatedPatient) {
            _res.status(404).json({ error: 'Patient not found' });
            return;
        }
        _res.send(updatedPatient);
        console.log(`Patient with id ${_req.params.patientId} updated from DB`);
    }
    catch (error) {
        _res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updatePatient = updatePatient;
const deletePatient = async (_req, _res) => {
    try {
        console.log('Patient ID:', _req.params.patientId);
        const deletedPatient = await patient_1.default.findByIdAndDelete(_req.params.patientId);
        if (!deletedPatient) {
            _res.status(404).json({ error: 'Patient not found' });
            return;
        }
        _res.json({ message: 'Patient deleted successfully' });
        console.log(`Patient with id ${_req.params.patientId} Deleted from DB`);
    }
    catch (error) {
        _res.status(500).json({ error: 'Internal server error' });
    }
};
exports.deletePatient = deletePatient;
