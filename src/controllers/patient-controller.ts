import { IPatient } from "../models/patient"; // Import the interface
import PatientModel from "../models/patient"; // Import the model
import { Request, Response, NextFunction } from "express";
import { validateNull } from "../helper/nullCheck";
export const getAllPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const patients = await PatientModel.find();
    console.log(patients);
    if (patients.length === 0) {
      return next({ statusCode: 404, message: "No Patient in DB" });
    }

    res.status(200).json(patients);
  } catch (error: any) {
    console.log(`Error fetching patients: ${error}`);
    next({ statusCode: 500, message: "Internal server error" });
  }
};

export const createPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newPatient = await PatientModel.create(req.body);
    // if (
    //   !newPatient.petName ||
    //   !newPatient.ownerName ||
    //   !newPatient.ownerPhone ||
    //   !newPatient.ownerAddress ||
    //   !newPatient.petType
    // ) {
    //   return next({ statusCode: 400, message: "Bad Request" });
    // }
    res.status(201).send(newPatient);
  } catch (error: any) {
    next({ statusCode: 500, message: "Internal Server Error" });
  }
};
export const updatePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedPatient = await PatientModel.updateOne(
      { _id: req.params.patientId },
      { $set: req.body }
    );
    //validateNull(updatedPatient, "Bad Request", 400);
    if (!updatedPatient) {
      next({ statusCode: 404, message: "Patient not found" });
      return;
    }
    res.send(updatedPatient);
    res.status(200);
  } catch (error) {
    next({ statusCode: 500, message: "Internal server error" });
  }
};
export const deletePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deletedPatient = await PatientModel.findByIdAndDelete(
      req.params.patientId
    );
    //validateNull(deletePatient, "Patient not found", 404);
    if (!deletedPatient) {
      return next({ statusCode: 404, message: "Patient not found" });
    }
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    next({ statusCode: 500, message: "Internal server error" });
  }
};
