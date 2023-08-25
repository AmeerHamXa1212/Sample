import { Request, Response, NextFunction } from "express";
import * as appointmentController from "../controllers/appointment-controller";
import appointmentModel, { IAppointments } from "../models/appointment";
import mongoose from "mongoose";
import PatientModel from "../models/patient";
import { EPaymentType } from "../models/appointment";

jest.mock("../models/appointment");
jest.mock("../models/patient");
describe("Appointment Controller - Unit Test", () => {
  let mockRequest = {} as Request;
  let mockResponse: Response;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockNext = jest.fn();
    mockResponse = {
      json: jest.fn(() => mockResponse),
      status: jest.fn(() => mockResponse),
      send: jest.fn(),
    } as unknown as Response;
  });
  jest.clearAllMocks();

  it("should get all appointments", async () => {
    const mockAppointment = [
      { appointmentId: 1, paymentAmount: 100, isPaid: true, patientId: 123 },
    ];
    appointmentModel.find = jest.fn().mockResolvedValue(mockAppointment);

    await appointmentController.getAllAppointment(
      mockRequest,
      mockResponse,
      mockNext
    );
    expect(appointmentModel.find).toHaveBeenCalled();
    expect(mockResponse.json).toHaveBeenCalledWith(mockAppointment);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });

  it("should retrieve unpaid appointments", async () => {
    const mockAppointment = [
      { appointmentId: 1, paymentAmount: 100, isPaid: false, patientId: 123 },
    ];

    appointmentModel.find = jest.fn().mockResolvedValue(mockAppointment);
    const mockRequest = {} as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response; //as unknown as Response;
    const mockNext: NextFunction = jest.fn();
    await appointmentController.getUnpaidAppointments(
      mockRequest,
      mockResponse,
      mockNext
    );
    expect(appointmentModel.find).toHaveBeenCalledWith({ isPaid: false });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });

  it("should retrieve failed unpaid appointments", async () => {
    const mockAppointment: any = [];
    appointmentModel.find = jest.fn().mockResolvedValue(mockAppointment);

    const mockRequest = {} as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const mockNext: NextFunction = jest.fn();

    await appointmentController.getUnpaidAppointments(
      mockRequest,
      mockResponse,
      mockNext
    );
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
    } as unknown as Request;
    PatientModel.findById = jest.fn().mockResolvedValue({
      _id: "mockPatientId",
      petName: "Mock Pet",
    });
    const mockSavedAppointment = {
      _id: "mockAppointmentId",
      ...mockRequest.body,
    };
    const saveMock = jest.fn().mockResolvedValue(mockSavedAppointment);
    appointmentModel.prototype.save = saveMock;
    await appointmentController.addAppointmentToPatient(
      mockRequest,
      mockResponse,
      mockNext
    );
    expect(PatientModel.findById).toHaveBeenCalledWith("mockPatientId");
    expect(saveMock).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(mockSavedAppointment);
  });

  it("should retrieve appointments for a given date", async () => {
    const mockAppointments = [
      {
        _id: new mongoose.Types.ObjectId(),
        startTime: new Date("2023-08-24T10:00:00Z"),
        endTime: new Date("2023-08-24T11:00:00Z"),
        description: "Mock appointment 1",
        paymentMethod: "USD",
        isPaid: true,
        paymentAmount: 100,
      },
      {
        _id: new mongoose.Types.ObjectId(),
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

    appointmentModel.find = jest.fn().mockResolvedValue(mockAppointments);

    const mockRequest = {
      params: {
        date: "2023-08-24",
      },
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const mockNext = jest.fn() as NextFunction;

    await appointmentController.getAppointmentsforDate(
      mockRequest,
      mockResponse,
      mockNext
    );

    expect(appointmentModel.find).toHaveBeenCalledWith({
      startTime: { $gte: mockStartOfDay, $lte: mockEndOfDay },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockAppointments);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
