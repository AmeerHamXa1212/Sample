import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler"; // Import express-async-handler
import { IPatient } from "../models/patient";
import PatientModel from "../models/patient";
import mongoose from "mongoose";

export const getAllPatient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const patients = await PatientModel.find();
    console.log(patients);
    if (patients.length === 0) {
      return next({ statusCode: 404, message: "No Patient in DB" });
    }

    res.status(200).json(patients);
  }
);

export const createPatient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const newPatient = await PatientModel.create(req.body);
    if (
      !newPatient.petName ||
      !newPatient.ownerName ||
      !newPatient.ownerPhone ||
      !newPatient.ownerAddress ||
      !newPatient.petType
    ) {
      return next({ statusCode: 400, message: "Bad Request" });
    }
    res.status(201).send(newPatient);
  }
);

export const updatePatient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const patientId = req.params.patientId;

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      next({ statusCode: 400, message: "Invalid ObjectId format" });
      return;
    }

    const updatedPatient = await PatientModel.findByIdAndUpdate(
      patientId,
      { $set: req.body },
      { new: true } // Return the updated document
    );

    if (!updatedPatient) {
      next({ statusCode: 404, message: "Patient not found" });
      return;
    }
    res.status(200).json(updatedPatient);
  }
);

export const deletePatient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const patientId = req.params.patientId;
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      next({ statusCode: 400, message: "Invalid ObjectId format" });
      return;
    }

    const deletedPatient = await PatientModel.findByIdAndDelete(
      req.params.patientId
    );
    if (!deletedPatient) {
      return next({ statusCode: 404, message: "Patient not found" });
    }
    res.status(200).json({ message: "Patient deleted successfully" });
  }
);
