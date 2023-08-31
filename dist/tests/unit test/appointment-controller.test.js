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
const appointmentController = __importStar(require("../../controllers/appointment-controller"));
const appointment_1 = __importDefault(require("../../models/appointment"));
const mongoose_1 = __importDefault(require("mongoose"));
const patient_1 = __importDefault(require("../../models/patient"));
jest.mock("../models/appointment");
jest.mock("../models/patient");
describe("Appointment Controller - Unit Test", () => {
    let mockRequest = {};
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
    jest.clearAllMocks();
    it("should get all appointments", async () => {
        const mockAppointment = [
            { appointmentId: 1, paymentAmount: 100, isPaid: true, patientId: 123 },
        ];
        appointment_1.default.find = jest.fn().mockResolvedValue(mockAppointment);
        await appointmentController.getAllAppointment(mockRequest, mockResponse, mockNext);
        expect(appointment_1.default.find).toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith(mockAppointment);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
    it("should retrieve unpaid appointments", async () => {
        const mockAppointment = [
            { appointmentId: 1, paymentAmount: 100, isPaid: false, patientId: 123 },
        ];
        appointment_1.default.find = jest.fn().mockResolvedValue(mockAppointment);
        const mockRequest = {};
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }; //as unknown as Response;
        const mockNext = jest.fn();
        await appointmentController.getUnpaidAppointments(mockRequest, mockResponse, mockNext);
        expect(appointment_1.default.find).toHaveBeenCalledWith({ isPaid: false });
        expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
    it("should retrieve failed unpaid appointments", async () => {
        const mockAppointment = [];
        appointment_1.default.find = jest.fn().mockResolvedValue(mockAppointment);
        const mockRequest = {};
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const mockNext = jest.fn();
        await appointmentController.getUnpaidAppointments(mockRequest, mockResponse, mockNext);
        expect(mockNext).toHaveBeenCalledWith({
            statusCode: 404,
            message: "No Unpaid Appointment",
        });
    });
    it("should add new appointment to patient", async () => {
        mockRequest = {
            body: {
                startTime: new Date(),
                endTime: new Date(),
                description: "Mock appointment description",
                patientId: "mockPatientId",
                isPaid: true,
                paymentAmount: 10,
            },
        };
        patient_1.default.findById = jest.fn().mockResolvedValue({
            _id: "mockPatientId",
            petName: "Mock Pet",
        });
        const mockSavedAppointment = {
            _id: "mockAppointmentId",
            ...mockRequest.body,
        };
        const saveMock = jest.fn().mockResolvedValue(mockSavedAppointment);
        appointment_1.default.prototype.save = saveMock;
        await appointmentController.addAppointmentToPatient(mockRequest, mockResponse, mockNext);
        expect(patient_1.default.findById).toHaveBeenCalledWith("mockPatientId");
        expect(saveMock).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith(mockSavedAppointment);
    });
    it("should retrieve appointments for a given date", async () => {
        const mockAppointments = [
            {
                _id: new mongoose_1.default.Types.ObjectId(),
                startTime: new Date("2023-07-24T10:00:00Z"),
                endTime: new Date("2023-07-24T11:00:00Z"),
                description: "Mock appointment 1",
                paymentMethod: "USD",
                isPaid: true,
                paymentAmount: 100,
            },
            {
                _id: new mongoose_1.default.Types.ObjectId(),
                startTime: new Date("2023-08-24T14:00:00Z"),
                endTime: new Date("2023-08-24T15:00:00Z"),
                description: "Mock appointment 2",
                paymentMethod: "EUR",
                isPaid: false,
                paymentAmount: 75,
            },
        ];
        const mockRequestedDate = new Date("2023-08-24");
        const mockStartOfDay = new Date(2023, 8, 24);
        const mockEndOfDay = new Date(2023, 8, 24, 23, 59, 59, 999);
        appointment_1.default.find = jest.fn().mockResolvedValue(mockAppointments);
        const mockRequest = {
            params: {
                date: "2023-08-24",
            },
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const mockNext = jest.fn();
        await appointmentController.getAppointmentsforDate(mockRequest, mockResponse, mockNext);
        expect(appointment_1.default.find).toHaveBeenCalledWith({
            startTime: { $gte: mockStartOfDay, $lte: mockEndOfDay },
        });
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockAppointments);
        expect(mockNext).not.toHaveBeenCalled();
    });
});
