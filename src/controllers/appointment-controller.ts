import express, { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { IAppointments } from "../models/appointment";
import AppointmentModel from "../models/appointment";
import { IPatient } from "../models/patient";
import PatientModel from "../models/patient";

export const getAllAppointmentForPatient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { patId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(patId)) {
      return next({ statusCode: 400, message: "Invalid Patient ID format" });
    }
    const appointments = await AppointmentModel.find({
      patientId: patId,
    }).populate("patientId");
    if (!appointments || appointments.length === 0) {
      return next({ statusCode: 404, message: "Appointments not found" });
    }
    res.status(200).json(appointments);
  }
);

export const updateAppointment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { appointId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(appointId)) {
      return next({
        statusCode: 400,
        message: "Invalid Appointment ID format",
      });
    }
    const updatedPost = await AppointmentModel.findByIdAndUpdate(
      appointId,
      req.body,
      { new: true }
    ).populate("patientId");
    if (!updatedPost) {
      return next({ statusCode: 404, message: "Appointment not found" });
    }
    res.status(200).json(updatedPost);
  }
);
export const deleteAppointment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { appointId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(appointId)) {
      return next({
        statusCode: 400,
        message: "Invalid Appointment ID format",
      });
    }
    const deletedPost = await AppointmentModel.findByIdAndDelete(
      appointId
    ).populate("patientId");
    if (!deletedPost) {
      return next({ statusCode: 404, message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
  }
);

export const addAppointmentToPatient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { patientId, ...appointmentData } = req.body;

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return next({ statusCode: 400, message: "Invalid Patient ID format" });
    }
    const existingPatient = await PatientModel.findById(patientId);
    if (!existingPatient) {
      return next({ statusCode: 404, message: "Patient not found" });
    }
    const newAppointment = new AppointmentModel({
      ...appointmentData,
      patientId: existingPatient._id,
    });
    const savedAppointment = await newAppointment.save();
    if (!savedAppointment) {
      return next({ statusCode: 400, message: "Saved Appointment failed" });
    }
    res.status(201).json(savedAppointment);
  }
);

export const getUnpaidAppointments = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const unpaidAppointments = await AppointmentModel.find({ isPaid: false });
    if (unpaidAppointments.length === 0) {
      return next({ statusCode: 404, message: "No Unpaid Appointment" });
    }
    res.status(200).json(unpaidAppointments);
  }
);
export const getAppointmentsforDate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const requestedDate = new Date(req.params.date);
    const startOfDay = new Date(
      requestedDate.getFullYear(),
      requestedDate.getMonth(),
      requestedDate.getDate()
    );
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999); // function to mark end of day
    const appointments = await AppointmentModel.find({
      startTime: { $gte: startOfDay, $lte: endOfDay },
    });
    if (appointments.length === 0) {
      return next({
        statusCode: 404,
        message: "No Appointments for the given date",
      });
    }
    res.status(200).json(appointments);
  }
);
export const getRemainingBill = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const unpaidSum = await AppointmentModel.aggregate([
      { $match: { isPaid: false } },
      { $group: { _id: null, total: { $sum: "$paymentAmount" } } },
    ]);

    if (unpaidSum.length === 0) {
      return next({
        statusCode: 404,
        message: "No Unpaid Appointments, therefore RemainingBill = Null",
      });
    }
    res.status(200).json(`Total Remaining Bill ${unpaidSum[0].total}`);
  }
);

export const getPopularPatient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const popularPatient = await AppointmentModel.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: "$patientId",
          totalPayment: { $sum: "$paymentAmount" },
        },
      },
      { $sort: { totalPayment: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "patientCollection",
          localField: "_id",
          foreignField: "_id",
          as: "patient",
        },
      },
      { $unwind: { path: "$patient", preserveNullAndEmptyArrays: true } },
    ]);

    if (popularPatient.length === 0) {
      return next({ statusCode: 404, message: "No Popular Patient Found" });
    }
    const popularPatientData = popularPatient[0];
    res.status(200).json({
      patient: popularPatientData._id,
      totalPayment: popularPatientData.totalPayment,
    });
  }
);
export const getAllAppointment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const appointments = await AppointmentModel.find();

    if (appointments.length === 0) {
      return next({ statusCode: 404, message: "No Appointment Available" });
    }
    res.status(200).json(appointments);
  }
);

export const getAppointmentFinancials = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AppointmentModel.aggregate([
      {
        $group: {
          _id: {
            paymentType: "$paymentMethod",
            week: { $week: "$startTime" },
            month: { $month: "$startTime" },
          },
          paidAmount: {
            $sum: {
              $cond: [{ $eq: ["$isPaid", true] }, "$paymentAmount", 0],
            },
          },
          unpaidAmount: {
            $sum: {
              $cond: [{ $eq: ["$isPaid", false] }, "$paymentAmount", 0],
            },
          },
        },
      },
      {
        $project: {
          paymentType: "$_id.paymentType",
          week: "$_id.week",
          month: "$_id.month",
          paidAmount: 1,
          unpaidAmount: 1,
          balance: { $subtract: ["$paidAmount", "$unpaidAmount"] },
        },
      },
    ]);

    if (result.length === 0) {
      return next({ statusCode: 404, message: "No financial data found" });
    }
    res.status(200).json(result);
  }
);
