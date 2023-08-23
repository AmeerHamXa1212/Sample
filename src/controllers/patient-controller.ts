import { IPatient } from '../models/patient'; // Import the interface
import PatientModel from '../models/patient'; // Import the model

import { Request, Response, NextFunction } from 'express';

export const getAllPatient = async (_req: Request, res: Response, _next: NextFunction) => {
  try {
    const patients = await PatientModel.find();
    res.json(patients);
    console.log("Patients Fetched from DB");
  } catch (error) {
    _next({ statusCode: 500, message: 'Internal server error' });
  }
};

export const createPatient = async (_req: Request, res: Response, _next: NextFunction) => {
  try {
    const newPatient = await PatientModel.create(_req.body);
    res.status(201).send(newPatient);
    console.log("New Patient Added");
  } catch (error:any) {
    _next({ statusCode: 400, message: error.message });
  }
};

export const updatePatient = async (_req: Request, _res: Response, _next: NextFunction) => {
  try {
    const updatedPatient = await PatientModel.updateOne(
      { _id: _req.params.patientId },
      { $set: _req.body }
    );

    if (!updatedPatient) {
      _next({ statusCode: 404, message: 'Patient not found' });
      return;
    }

    _res.send(updatedPatient);
    console.log(`Patient with id ${_req.params.patientId} updated from DB`);
  } catch (error) {
    _next({ statusCode: 500, message: 'Internal server error' });
  }
};

export const deletePatient = async (_req: Request, _res: Response, _next: NextFunction) => {
  try {
    console.log('Patient ID:', _req.params.patientId);
    const deletedPatient = await PatientModel.findByIdAndDelete(_req.params.patientId);

    if (!deletedPatient) {
      _next({ statusCode: 404, message: 'Patient not found' });
      return;
    }

    _res.json({ message: 'Patient deleted successfully' });
    console.log(`Patient with id ${_req.params.patientId} Deleted from DB`);
  } catch (error) {
    _next({ statusCode: 500, message: 'Internal server error' });
  }
};
