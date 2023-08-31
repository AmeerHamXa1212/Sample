"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const patientController = __importStar(require("../../controllers/patient-controller"));
const patient_1 = __importDefault(require("../../models/patient"));
jest.mock("../models/patient");
describe("Patient Controller Function being tested ", () => {
    const mockRequest = {};
    let mockResponse;
    let mockNext;
    beforeEach(() => {
        mockNext = jest.fn();
        mockResponse = {
            json: jest.fn(() => mockResponse),
            status: jest.fn(() => mockResponse),
            send: jest.fn(),
        };
    });
    it("should get all patients", async () => {
        const mockPatients = [{ name: "Cat", type: "cat" }];
        patient_1.default.find = jest.fn().mockResolvedValue(mockPatients);
        await patientController.getAllPatient(mockRequest, mockResponse, mockNext);
        expect(patient_1.default.find).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockPatients);
    });
    it("should return 'No Patient in DB' error when no patients are found during GET", async () => {
        patient_1.default.find = jest.fn().mockResolvedValue([]);
        await patientController.getAllPatient(mockRequest, mockResponse, mockNext);
        expect(mockNext).toHaveBeenCalledWith({
            statusCode: 404,
            message: "No Patient in DB",
        });
    });
    it("should return internal server error when an error occurs during GET", async () => {
        const mockError = new Error("Test error");
        patient_1.default.find = jest.fn().mockRejectedValue(mockError);
        await patientController.getAllPatient(mockRequest, mockResponse, mockNext);
        expect(mockNext).toHaveBeenCalledWith({
            statusCode: 500,
            message: "Internal server error",
        });
    });
    it("should return 'Bad Request' error when any property is missing during CREATE", async () => {
        patient_1.default.find = jest.fn().mockResolvedValue([]);
        await patientController.getAllPatient(mockRequest, mockResponse, mockNext);
        expect(mockNext).toHaveBeenCalledWith({
            statusCode: 404,
            message: "No Patient in DB",
        });
    });
    it("should create a new patient", async () => {
        const mockPatient = {
            petName: "Dog",
            type: "dog",
            owner: "meeee",
            phone: "1232414",
            address: "afsfafq",
        };
        patient_1.default.create = jest.fn().mockResolvedValue(mockPatient);
        mockRequest.body = mockPatient;
        await patientController.createPatient(mockRequest, mockResponse, mockNext);
        expect(patient_1.default.create).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.send).toHaveBeenCalledWith(mockPatient);
    });
    it("should return internal server error when an error occurs during CREATE", async () => {
        const mockError = new Error("Test error");
        patient_1.default.create = jest.fn().mockRejectedValue(mockError);
        await patientController.createPatient(mockRequest, mockResponse, mockNext);
        expect(mockNext).toHaveBeenCalledWith({
            statusCode: 500,
            message: "Internal Server Error",
        });
    });
    it("should UPDATE patient ", async () => {
        const mockUpdatedPatient = { name: "Updat Dog", type: "dog" };
        const mockPatientId = "mockPatientId";
        patient_1.default.updateOne = jest.fn().mockResolvedValue({ nModified: 1 });
        mockRequest.params = { patientId: mockPatientId };
        mockRequest.body = mockUpdatedPatient;
        await patientController.updatePatient(mockRequest, mockResponse, mockNext);
        expect(patient_1.default.updateOne).toHaveBeenCalledWith({ _id: mockPatientId }, { $set: mockUpdatedPatient });
        expect(patient_1.default.updateOne).toHaveBeenCalled();
        expect(mockResponse.send).toHaveBeenCalledWith({ nModified: 1 });
        expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
    it("should delete a patient", async () => {
        const mockPatientId = "mockPatientId";
        patient_1.default.findByIdAndDelete = jest
            .fn()
            .mockResolvedValue({ name: "Deleted Dog", type: "dog" });
        mockRequest.params = { patientId: mockPatientId };
        await patientController.deletePatient(mockRequest, mockResponse, mockNext);
        expect(patient_1.default.findByIdAndDelete).toHaveBeenCalledWith(mockPatientId);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "Patient deleted successfully",
        });
    });
    it("should return 'Patient not found' error when patient is not found during DELETE", async () => {
        const mockPatientId = "mockPatientId";
        patient_1.default.findByIdAndDelete = jest.fn().mockResolvedValue(null);
        mockRequest.params = { patientId: mockPatientId };
        await patientController.deletePatient(mockRequest, mockResponse, mockNext);
        expect(patient_1.default.findByIdAndDelete).toHaveBeenCalledWith(mockPatientId);
        expect(mockNext).toHaveBeenCalledWith({
            statusCode: 404,
            message: "Patient not found",
        });
    });
    it("should return internal server error when an error occurs", async () => {
        const mockPatientId = "mockPatientId";
        const mockError = new Error("Test error");
        patient_1.default.findByIdAndDelete = jest.fn().mockRejectedValue(mockError);
        mockRequest.params = { patientId: mockPatientId };
        await patientController.deletePatient(mockRequest, mockResponse, mockNext);
        expect(patient_1.default.findByIdAndDelete).toHaveBeenCalledWith(mockPatientId);
        expect(mockNext).toHaveBeenCalledWith({
            statusCode: 500,
            message: "Internal server error",
        });
    });
});
