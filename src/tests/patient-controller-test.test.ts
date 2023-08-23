import { Request, Response, NextFunction } from 'express';
import * as patientController from '../controllers/patient-controller';
import PatientModel from '../models/patient';

// Mock the PatientModel
jest.mock('../models/patient');

describe('Patient Controller - Unit Tests', () => {
  const mockRequest = {} as Request;
  let mockResponse: Response;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockNext = jest.fn();
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(), // Properly mock status chaining
      send: jest.fn(), // Properly mock send function
    } as unknown as Response;
  })

  it('should get all patients', async () => {
    const mockPatients = [{ name: 'Cat', type: 'cat' }];
    PatientModel.find = jest.fn().mockResolvedValue(mockPatients);

    await patientController.getAllPatient(mockRequest, mockResponse, mockNext);

    expect(mockResponse.json).toHaveBeenCalledWith(mockPatients);
  });

  it('should create a new patient', async () => {
    const mockPatient = { name: 'Dog', type: 'dog' };
    PatientModel.create = jest.fn().mockResolvedValue(mockPatient);

    mockRequest.body = mockPatient;

    await patientController.createPatient(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    
    expect(mockResponse.send).toHaveBeenCalledWith(mockPatient);
  });

  it('should update a patient', async () => {
    const mockUpdatedPatient = { name: 'Updat Dog', type: 'dog' };
    const mockPatientId = 'mockPatientId';
    
    // Mock the updateOne function
    PatientModel.updateOne = jest.fn().mockResolvedValue({ nModified: 1 });

    mockRequest.params = { patientId: mockPatientId };
    mockRequest.body = mockUpdatedPatient;

    await patientController.updatePatient(mockRequest, mockResponse, mockNext);

    expect(PatientModel.updateOne).toHaveBeenCalledWith(
      { _id: mockPatientId },
      { $set: mockUpdatedPatient }
    );

    expect(mockResponse.send).toHaveBeenCalled();
  });

  it('should delete a patient', async () => {
    const mockPatientId = 'mockPatientId';
    
    // Mock the findByIdAndDelete function of PatientModel
    PatientModel.findByIdAndDelete = jest.fn().mockResolvedValue({ name: 'Deleted Dog', type: 'dog' });

    mockRequest.params = { patientId: mockPatientId };

    await patientController.deletePatient(mockRequest, mockResponse, mockNext);

    expect(PatientModel.findByIdAndDelete).toHaveBeenCalledWith(mockPatientId);

    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Patient deleted successfully' });
  });



});
