"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppointmentFinancials = exports.getAllAppointment = exports.getPopularPatient = exports.getRemainingBill = exports.getAppointmentsforDate = exports.getUnpaidAppointments = exports.addAppointmentToPatient = exports.deleteAppointment = exports.updateAppointment = exports.getAllAppointmentForPatient = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const mongoose_1 = __importDefault(require("mongoose"));
const appointment_1 = __importDefault(require("../models/appointment"));
const patient_1 = __importDefault(require("../models/patient"));
exports.getAllAppointmentForPatient = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { patId } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(patId)) {
        return next({ statusCode: 400, message: "Invalid Patient ID format" });
    }
    const appointments = await appointment_1.default.find({
        patientId: patId,
    }).populate("patientId");
    if (!appointments || appointments.length === 0) {
        return next({ statusCode: 404, message: "Appointments not found" });
    }
    res.status(200).json(appointments);
});
exports.updateAppointment = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { appointId } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(appointId)) {
        return next({
            statusCode: 400,
            message: "Invalid Appointment ID format",
        });
    }
    const updatedPost = await appointment_1.default.findByIdAndUpdate(appointId, req.body, { new: true }).populate("patientId");
    if (!updatedPost) {
        return next({ statusCode: 404, message: "Appointment not found" });
    }
    res.status(200).json(updatedPost);
});
exports.deleteAppointment = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { appointId } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(appointId)) {
        return next({
            statusCode: 400,
            message: "Invalid Appointment ID format",
        });
    }
    const deletedPost = await appointment_1.default.findByIdAndDelete(appointId).populate("patientId");
    if (!deletedPost) {
        return next({ statusCode: 404, message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
});
exports.addAppointmentToPatient = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { patientId, ...appointmentData } = req.body;
    if (!mongoose_1.default.Types.ObjectId.isValid(patientId)) {
        return next({ statusCode: 400, message: "Invalid Patient ID format" });
    }
    const existingPatient = await patient_1.default.findById(patientId);
    if (!existingPatient) {
        return next({ statusCode: 404, message: "Patient not found" });
    }
    const newAppointment = new appointment_1.default({
        ...appointmentData,
        patientId: existingPatient._id,
    });
    const savedAppointment = await newAppointment.save();
    if (!savedAppointment) {
        return next({ statusCode: 400, message: "Saved Appointment failed" });
    }
    res.status(201).json(savedAppointment);
});
exports.getUnpaidAppointments = (0, express_async_handler_1.default)(async (req, res, next) => {
    const unpaidAppointments = await appointment_1.default.find({ isPaid: false });
    if (unpaidAppointments.length === 0) {
        return next({ statusCode: 404, message: "No Unpaid Appointment" });
    }
    res.status(200).json(unpaidAppointments);
});
exports.getAppointmentsforDate = (0, express_async_handler_1.default)(async (req, res, next) => {
    const requestedDate = new Date(req.params.date);
    const startOfDay = new Date(requestedDate.getFullYear(), requestedDate.getMonth(), requestedDate.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999); // function to mark end of day
    const appointments = await appointment_1.default.find({
        startTime: { $gte: startOfDay, $lte: endOfDay },
    });
    if (appointments.length === 0) {
        return next({
            statusCode: 404,
            message: "No Appointments for the given date",
        });
    }
    res.status(200).json(appointments);
});
exports.getRemainingBill = (0, express_async_handler_1.default)(async (req, res, next) => {
    const unpaidSum = await appointment_1.default.aggregate([
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
});
exports.getPopularPatient = (0, express_async_handler_1.default)(async (req, res, next) => {
    const popularPatient = await appointment_1.default.aggregate([
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
});
exports.getAllAppointment = (0, express_async_handler_1.default)(async (req, res, next) => {
    const appointments = await appointment_1.default.find();
    if (appointments.length === 0) {
        return next({ statusCode: 404, message: "No Appointment Available" });
    }
    res.status(200).json(appointments);
});
exports.getAppointmentFinancials = (0, express_async_handler_1.default)(async (req, res, next) => {
    const result = await appointment_1.default.aggregate([
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
});