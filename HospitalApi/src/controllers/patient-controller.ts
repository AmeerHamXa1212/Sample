import express,{ Request, Response } from 'express';
import { IPatient } from '../models/patient'; // Import the interface
import PatientModel from '../models/patient'; // Import the model


//Definition of controller function for patient

export const getAllPatient = async (_req: Request, res: Response) => {
   console.log("getAllPatients");
    try {
        const patients = await PatientModel.find();
        res.json(patients);
        console.log("Patients Fetched from DB")
    } 
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
  };

export const createPatient = async (_req:Request,res:Response) =>{
    try {
        const newPatient = await PatientModel.create(_req.body);
        res.status(201).send(newPatient);
        console.log("New Patient Added")
      } catch (error:any) {
        res.status(400).json({ error: error.message });
      }
}

export const updatePatient = async (_req:Request,_res:Response) => {
    try {
      const updatedPatient = await PatientModel.updateOne(
        { _id: _req.params.patientId },
        { $set: _req.body }
      )
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
}
export const deletePatient =async (_req:Request,_res:Response) => {
    try {
      console.log('Patient ID:', _req.params.patientId);
        const deletedPatient = await PatientModel.findByIdAndDelete(_req.params.patientId);
        if (!deletedPatient) {
          _res.status(404).json({ error: 'Patient not found' });
          return;
        }
        _res.json({ message: 'Patient deleted successfully' });
        console.log(`Patient with id ${_req.params.patientId} Deleted from DB`)
      } 
      catch (error) {
        _res.status(500).json({ error: 'Internal server error' });
      }
}