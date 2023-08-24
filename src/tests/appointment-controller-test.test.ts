// import { Request, Response, NextFunction } from 'express';
// import * as appointmentController from '../controllers/appointment-controller';
// import appointmentModel, { IAppointments } from '../models/appointment';
// import mongoose from 'mongoose'

// //step1 - mock db
// jest.mock('../models/appointment')
// describe("Appointment Controller Testing - Unit Test",()=>{
//     let mockRequest = {} as Request;
//     let mockResponse: Response;
//     let mockNext: NextFunction;
  
//     beforeEach(() => {
//       mockNext = jest.fn();
//       mockResponse = {
//         json: jest.fn(() => mockResponse),
//         status: jest.fn(() => mockResponse), // Properly mock status chaining
//         send: jest.fn(), // Properly mock send function
//       } as unknown as Response;
//     })

//     it("should get all appointments", async () => {
//         const mockAppointment = [{appointmentId: 1, paymentAmount: 100, isPaid: true, patientId: 123}];
        
//         // Mock the implementation of appointmentModel.find
//         appointmentModel.find = jest.fn().mockResolvedValue(mockAppointment)
    
//         // Call the controller function
//         await appointmentController.getAllAppointment(mockRequest, mockResponse, mockNext);
    
//         // Expectations
//         // expect(controllerAppointments).toEqual(mockAppointment); // Assuming the return format matches
//         expect(appointmentModel.find).toHaveBeenCalled()
//         expect(mockResponse.json).toHaveBeenCalledWith(mockAppointment)
//         expect(mockResponse.status).toHaveBeenCalledWith(200);

//     });
    
//     it('should create new appointment', async () => {
//         // Mocked appointment data
//         const mockRequest = {
//             params: {
//                 patId: 'patientId1',
//             },
//         } as unknown as Request;
        
//         mockRequest.body = {
//             startTime: new Date(),
//             endTime: new Date(),
//             description: 'Mock appointment description',
//             patientId: new mongoose.Types.ObjectId(), // Generate a new ObjectId
//             isPaid: true,
//             paymentAmount: 10
//         };
//         const mockAppointment = mockRequest.body
//         //await appointmentModel.findById(mockRequest.body.patientId)
//         console.log(mockResponse.status)
//         expect(appointmentModel.findById).toHaveBeenCalled();
//         //expect(mockResponse.status).toHaveBeenCalledWith(200);

//         //expect(mockResponse.json).toHaveBeenCalledWith(mockAppointment);
//     }); // This sets the timeout for this specific test case to 10000ms
    
// })