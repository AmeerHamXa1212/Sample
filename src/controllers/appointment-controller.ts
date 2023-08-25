import express, { Request, Response, NextFunction } from "express";
import { IAppointments } from "../models/appointment";
import AppointmentModel from "../models/appointment";
import { IPatient } from "../models/patient";
import PatientModel from "../models/patient";

export const getAllAppointmentForPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointments: any = await AppointmentModel.find({
      patientId: req.params.patId,
    }).populate("patientId");
    if (!appointments) {
      return next({ statusCode: 404, message: "Appointments not found" });
    }
    res.status(200).json(appointments);
  } catch (error) {
    next({ statusCode: 500, message: "Internal server error" });
  }
};
export const updateAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedPost = await AppointmentModel.findByIdAndUpdate(
      req.params.appointId,
      req.body,
      { new: true }
    ).populate("patientId");
    if (!updatedPost) {
      return next({ statusCode: 404, message: "Appointment not found" });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    next({ statusCode: 500, message: "Internal server error" });
  }
};

export const deleteAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deletedPost = await AppointmentModel.findByIdAndDelete(
      req.params.appointId,
      req.body
    ).populate("patientId");
    if (!deletedPost) {
      return next({ statusCode: 404, message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    return next({ statusCode: 500, message: "Internal Server Error" });
  }
};

export const addAppointmentToPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { patientId, ...appointmentData } = req.body;
    const existingPatient = await PatientModel.findById(patientId);
    if (!existingPatient) {
      return next({ statusCode: 404, message: "PatientNot found" });
    }
    const newAppointment = new AppointmentModel({
      ...appointmentData,
      patientId: existingPatient._id,
    });
    const savedAppointment = await newAppointment.save();
    if (savedAppointment) {
      res.status(201).json(savedAppointment);
    } else {
      return next({ statusCode: 400, message: "Saved Appointment failed" });
    }
  } catch (error) {
    return next({ statusCode: 500, message: "Internal Server Error" });
  }
};
export const getUnpaidAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const unpaidAppointments = await AppointmentModel.find({ isPaid: false });
    if (unpaidAppointments.length === 0) {
      return next({ statusCode: 404, message: "No Unpaid Appointment" });
    }
    res.status(200).json(unpaidAppointments);
  } catch (error) {
    return next({ statusCode: 500, message: "Internal Server Error" });
  }
};
export const getAppointmentsforDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
    if (!appointments || appointments.length === 0) {
      return next({
        statusCode: 404,
        message: "No Appointments for given date",
      });
    }
    res.status(200).json(appointments);
  } catch (err) {
    console.log(
      `Error in getting all appointments for date ${req.params.date}`,
      err
    );
    return next({ statusCode: 500, message: "Internal Server Error" });
  }
};
//get remaining bill of patient = bill amount of patients whose status is unpaid
export const getRemainingBill = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const unpaidSum = await AppointmentModel.aggregate([
      { $match: { isPaid: false } },
      { $group: { _id: null, total: { $sum: "$paymentAmount" } } },
    ]);
    if (!unpaidSum || unpaidSum.length === 0) {
      return next({
        statusCode: 404,
        message: "No Unpaid Appointments, therefore RemainingBill = Null",
      });
    }
    res.status(200).json(`Total Remaining Bill ${unpaidSum[0].total}`);
  } catch (error) {
    return next({ statusCode: 500, message: "Internal Server Error" });
  }
};

export const getPopularPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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

    if (!popularPatient || popularPatient.length === 0) {
      return next({ statusCode: 404, message: "No Popular Patient Found" });
    }
    const popularPatientData = popularPatient[0];
    res.status(200).json({
      patient: popularPatientData._id,
      totalPayment: popularPatientData.totalPayment,
    });
  } catch (error) {
    return next({ statusCode: 500, message: "Internal Server Error" });
  }
};

export const getAllAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const Appointment = await AppointmentModel.find();
    res.status(200).json(Appointment);
  } catch (error) {
    return next({ statusCode: 500, message: "Internal Server Error" });
  }
};

export const getAppointmentFinancials = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
              //if cond evaluate to TRUE sum is done on PaymentAmount else sum is done on 0
              $cond: [{ $eq: ["$isPaid", true] }, "$paymentAmount", 0],
            },
          },
          unpaidAmount: {
            $sum: {
              //if cond evaluate to TRUE sum is done on PaymentAmount else sum is done on 0
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

    if (!result || result.length === 0) {
      return next({ statusCode: 404, message: "No financial data found" });
    }
    res.status(200).json(result);
  } catch (error) {
    return next({ statusCode: 500, message: "Internal Server Error" });
  }
};
