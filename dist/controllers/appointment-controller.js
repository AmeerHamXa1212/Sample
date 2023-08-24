"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppointmentFinancials = exports.getAllAppointment = exports.getPopularPatient = exports.getRemainingBill = exports.getAppointmentsforDate = exports.getUnpaidAppointments = exports.addAppointmentToPatient = exports.deleteAppointment = exports.updateAppointment = exports.getAllAppointmentForPatient = void 0;
const appointment_1 = __importDefault(require("../models/appointment")); // Import the model
const patient_1 = __importDefault(require("../models/patient")); // Import the model
//Definition of controller function for appointment
const getAllAppointmentForPatient = async (req, res, next) => {
    try {
        const appointments = await appointment_1.default.find({ patientId: req.params.patId }).populate('patientId');
        if (!appointments) {
            return next({ statusCode: 404, message: 'Appointments not found' });
        }
        res.status(200).json(appointments);
    }
    catch (error) {
        console.log(`Error in retrieving all appointments for patient with ${req.params.patId}`, error);
        next({ statusCode: 500, message: 'Internal server error' });
    }
};
exports.getAllAppointmentForPatient = getAllAppointmentForPatient;
const updateAppointment = async (req, res, next) => {
    try {
        const updatedPost = await appointment_1.default.findByIdAndUpdate(req.params.appointId, req.body, { new: true }).populate('patientId');
        if (!updatedPost) {
            return next({ statusCode: 404, message: 'Appointment not found' });
        }
        res.status(200).json(updatedPost);
    }
    catch (error) {
        next({ statusCode: 500, message: 'Internal server error' });
    }
};
exports.updateAppointment = updateAppointment;
const deleteAppointment = async (_req, _res, _next) => {
    try {
        const deletedPost = await appointment_1.default.findByIdAndDelete(_req.params.appointId, _req.body).populate('patientId');
        if (!deletedPost) {
            return _next({ statusCode: 404, message: 'Appointment not found' });
        }
        _res.json({ message: 'Appointment deleted successfully' });
        console.log(`Appointment with id ${_req.params.appointId} Deleted from DB`);
    }
    catch (error) {
        return _next({ statusCode: 500, message: 'Internal Server Error' });
    }
};
exports.deleteAppointment = deleteAppointment;
const addAppointmentToPatient = async (_req, _res, _next) => {
    try {
        console.log('Request Body:', _req.body); // Add this line
        const { patientId, ...appointmentData } = _req.body;
        // Check patient with  ID exists
        const existingPatient = await patient_1.default.findById(patientId);
        if (!existingPatient) {
            return _next({ statusCode: 404, message: 'PatientNot found' });
        }
        const newAppointment = new appointment_1.default({
            ...appointmentData,
            patientId: existingPatient._id
        });
        const savedAppointment = await newAppointment.save();
        _res.status(201).json(savedAppointment);
        console.log(`Appointment with id ${savedAppointment._id} added to patient with id ${savedAppointment.patientId}`);
    }
    catch (error) {
        console.log('Error in adding appointment:', error);
        return _next({ statusCode: 500, message: 'Internal Server Error' });
    }
};
exports.addAppointmentToPatient = addAppointmentToPatient;
const getUnpaidAppointments = async (_req, _res, _next) => {
    try {
        const unpaidAppointments = await appointment_1.default.find({ isPaid: false });
        if (unpaidAppointments.length === 0) {
            return _next({ statusCode: 404, message: 'No Unpaid Appointment' });
        }
        console.log("Fetching Unpaid Appointments");
        _res.status(201).json(unpaidAppointments);
    }
    catch (error) {
        console.log('Error in finding unpaid appointment:', error);
        return _next({ statusCode: 500, message: 'Internal Server Error' });
    }
};
exports.getUnpaidAppointments = getUnpaidAppointments;
const getAppointmentsforDate = async (_req, _res, _next) => {
    try {
        const requestedDate = new Date(_req.params.date);
        const startOfDay = new Date(requestedDate.getFullYear(), requestedDate.getMonth(), requestedDate.getDate());
        const endOfDay = new Date(startOfDay);
        endOfDay.setHours(23, 59, 59, 999); // function to mark end of day
        const appointments = await appointment_1.default.find({ startTime: { $gte: startOfDay, $lte: endOfDay } });
        if (!appointments || appointments.length === 0) {
            return _next({ statusCode: 404, message: 'No Appointments for given date' });
        }
        _res.status(200).json(appointments);
    }
    catch (err) {
        console.log(`Error in getting all appointments for date ${_req.params.date}`, err);
        return _next({ statusCode: 500, message: 'Internal Server Error' });
    }
};
exports.getAppointmentsforDate = getAppointmentsforDate;
//get remaining bill of patient = bill amount of patients whose status is unpadi
const getRemainingBill = async (_req, _res, _next) => {
    try {
        const unpaidSum = await appointment_1.default.aggregate([
            //stage 1
            { $match: { isPaid: false } },
            //stage 2
            { $group: { _id: null, total: { $sum: "$paymentAmount" } } }
        ]);
        if (!unpaidSum || unpaidSum.length === 0) {
            return _next({ statusCode: 404, message: 'No Unpaid Appointments, therefore RemainingBill = Null' });
        }
        _res.status(200).json(`Total Remaining Bill ${unpaidSum[0].total}`);
        console.log(`Total Unpaid Sum is := ${unpaidSum[0].total}`);
    }
    catch (error) {
        console.log(`Error in getting appointments with remaining Bill : ${error}`);
        return _next({ statusCode: 500, message: 'Internal Server Error' });
    }
};
exports.getRemainingBill = getRemainingBill;
const getPopularPatient = async (_req, _res, _next) => {
    try {
        const popularPatient = await appointment_1.default.aggregate([
            //stage 1
            { $match: { isPaid: true } },
            //stage 2
            {
                $group: {
                    _id: "$patientId", totalPayment: { $sum: "$paymentAmount" }
                }
            },
            //stage 3
            { $sort: { totalPayment: -1 } },
            //stage 4
            { $limit: 1 },
            //stage 5
            { $lookup: { from: "patientCollection", localField: "_id", foreignField: "_id", as: "patient" } },
            //stage 6
            { $unwind: { path: "$patient", preserveNullAndEmptyArrays: true } }
        ]);
        if (!popularPatient || popularPatient.length === 0) {
            return _next({ statusCode: 404, message: 'No Popular Patient Found' });
        }
        const popularPatientData = popularPatient[0];
        _res.status(200).json({
            patient: popularPatientData._id,
            totalPayment: popularPatientData.totalPayment
        });
        console.log(`Popular Patient in the DB is : ${popularPatient[0]._id} and its payment is ${popularPatientData.totalPayment} `);
    }
    catch (error) {
        console.log(`Error in getting Popular patient : ${error}`);
        return _next({ statusCode: 500, message: 'Internal Server Error' });
    }
};
exports.getPopularPatient = getPopularPatient;
const getAllAppointment = async (_req, res, _next) => {
    try {
        const Appointment = await appointment_1.default.find();
        res.status(200).json(Appointment);
    }
    catch (error) {
        return _next({ statusCode: 500, message: 'Internal Server Error' });
    }
};
exports.getAllAppointment = getAllAppointment;
//paid and unpaid
const getAppointmentFinancials = async (_req, _res, _next) => {
    try {
        const result = await appointment_1.default.aggregate([
            {
                $group: {
                    _id: {
                        paymentType: '$paymentMethod',
                        week: { $week: '$startTime' },
                        month: { $month: '$startTime' },
                    },
                    paidAmount: {
                        $sum: {
                            //if cond evaluate to TRUE sum is done on PaymentAmount else sum is done on 0
                            $cond: [{ $eq: ['$isPaid', true] }, '$paymentAmount', 0]
                        }
                    },
                    unpaidAmount: {
                        $sum: {
                            //if cond evaluate to TRUE sum is done on PaymentAmount else sum is done on 0
                            $cond: [{ $eq: ['$isPaid', false] }, '$paymentAmount', 0]
                        }
                    }
                }
            },
            {
                $project: {
                    paymentType: '$_id.paymentType', week: '$_id.week', month: '$_id.month', paidAmount: 1, unpaidAmount: 1,
                    balance: { $subtract: ['$paidAmount', '$unpaidAmount'] }
                }
            }
        ]);
        if (!result || result.length === 0) {
            return _next({ statusCode: 404, message: 'No financial data found' });
        }
        console.log("Generating financial report of all Appointments");
        _res.status(200).json(result);
    }
    catch (error) {
        console.log(`Error in getting financial report: ${error}`);
        return _next({ statusCode: 500, message: 'Internal Server Error' });
    }
};
exports.getAppointmentFinancials = getAppointmentFinancials;
