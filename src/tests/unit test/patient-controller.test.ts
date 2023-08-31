import { Request, Response, NextFunction } from "express";
import * as patientController from "../../controllers/patient-controller";
import PatientModel from "../../models/patient";

jest.mock("../models/patient");

describe("Patient Controller Function being tested ", () => {
  const mockRequest = {} as Request;
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

  it("should get all patients", async () => {
    const mockPatients = [{ name: "Cat", type: "cat" }];
    PatientModel.find = jest.fn().mockResolvedValue(mockPatients);

    await patientController.getAllPatient(mockRequest, mockResponse, mockNext);

    expect(PatientModel.find).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockPatients);
  });

  it("should return 'No Patient in DB' error when no patients are found during GET", async () => {
    PatientModel.find = jest.fn().mockResolvedValue([]);

    await patientController.getAllPatient(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith({
      statusCode: 404,
      message: "No Patient in DB",
    });
  });

  it("should return internal server error when an error occurs during GET", async () => {
    const mockError = new Error("Test error");
    PatientModel.find = jest.fn().mockRejectedValue(mockError);

    await patientController.getAllPatient(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith({
      statusCode: 500,
      message: "Internal server error",
    });
  });

  it("should return 'Bad Request' error when any property is missing during CREATE", async () => {
    PatientModel.find = jest.fn().mockResolvedValue([]);

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
    PatientModel.create = jest.fn().mockResolvedValue(mockPatient);

    mockRequest.body = mockPatient;

    await patientController.createPatient(mockRequest, mockResponse, mockNext);

    expect(PatientModel.create).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.send).toHaveBeenCalledWith(mockPatient);
  });

  it("should return internal server error when an error occurs during CREATE", async () => {
    const mockError = new Error("Test error");
    PatientModel.create = jest.fn().mockRejectedValue(mockError);

    await patientController.createPatient(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith({
      statusCode: 500,
      message: "Internal Server Error",
    });
  });

  it("should UPDATE patient ", async () => {
    const mockUpdatedPatient = { name: "Updat Dog", type: "dog" };
    const mockPatientId = "mockPatientId";
    PatientModel.updateOne = jest.fn().mockResolvedValue({ nModified: 1 });

    mockRequest.params = { patientId: mockPatientId };
    mockRequest.body = mockUpdatedPatient;

    await patientController.updatePatient(mockRequest, mockResponse, mockNext);
    expect(PatientModel.updateOne).toHaveBeenCalledWith(
      { _id: mockPatientId },
      { $set: mockUpdatedPatient }
    );
    expect(PatientModel.updateOne).toHaveBeenCalled();
    expect(mockResponse.send).toHaveBeenCalledWith({ nModified: 1 });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });

  it("should delete a patient", async () => {
    const mockPatientId = "mockPatientId";
    PatientModel.findByIdAndDelete = jest
      .fn()
      .mockResolvedValue({ name: "Deleted Dog", type: "dog" });

    mockRequest.params = { patientId: mockPatientId };
    await patientController.deletePatient(mockRequest, mockResponse, mockNext);

    expect(PatientModel.findByIdAndDelete).toHaveBeenCalledWith(mockPatientId);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Patient deleted successfully",
    });
  });

  it("should return 'Patient not found' error when patient is not found during DELETE", async () => {
    const mockPatientId = "mockPatientId";
    PatientModel.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    mockRequest.params = { patientId: mockPatientId };
    await patientController.deletePatient(mockRequest, mockResponse, mockNext);

    expect(PatientModel.findByIdAndDelete).toHaveBeenCalledWith(mockPatientId);
    expect(mockNext).toHaveBeenCalledWith({
      statusCode: 404,
      message: "Patient not found",
    });
  });

  it("should return internal server error when an error occurs", async () => {
    const mockPatientId = "mockPatientId";
    const mockError = new Error("Test error");
    PatientModel.findByIdAndDelete = jest.fn().mockRejectedValue(mockError);

    mockRequest.params = { patientId: mockPatientId };
    await patientController.deletePatient(mockRequest, mockResponse, mockNext);

    expect(PatientModel.findByIdAndDelete).toHaveBeenCalledWith(mockPatientId);
    expect(mockNext).toHaveBeenCalledWith({
      statusCode: 500,
      message: "Internal server error",
    });
  });
});
