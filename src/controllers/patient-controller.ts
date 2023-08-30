import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { IPatient } from "../models/patient";
import PatientModel from "../models/patient";
import mongoose from "mongoose";

const generateErrorResponse = (statusCode: number, message: string) => {
  return { statusCode, message };
};

const checkNullAndEmpty = (value: any, errorMessage: string) => {
  if (value === null || value.length === 0) {
    throw generateErrorResponse(404, errorMessage);
  }
};

export const getAllPatient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const patients = await PatientModel.find();
    checkNullAndEmpty(patients, "No Patient in DB");

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
      return next(generateErrorResponse(400, "Bad Request"));
    }
    res.status(201).send(newPatient);
  }
);

export const updatePatient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const patientId = req.params.patientId;

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return next(generateErrorResponse(400, "Invalid ObjectId format"));
    }

    const updatedPatient = await PatientModel.findByIdAndUpdate(
      patientId,
      { $set: req.body },
      { new: true }
    );
    checkNullAndEmpty(updatedPatient, "Patient not found");

    res.status(200).json(updatedPatient);
  }
);

export const deletePatient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const patientId = req.params.patientId;
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return next(generateErrorResponse(400, "Invalid ObjectId format"));
    }
    const deletedPatient = await PatientModel.findByIdAndDelete(
      req.params.patientId
    );
    checkNullAndEmpty(deletedPatient, "Patient not found");

    res.status(200).json({ message: "Patient deleted successfully" });
  }
);
