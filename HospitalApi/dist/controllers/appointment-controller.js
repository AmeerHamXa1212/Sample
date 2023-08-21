"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppointmentFinancials = exports.getAllAppointment = exports.getPopularPatient = exports.getRemainingBill = exports.getAppointmentsforDate = exports.getUnpaidAppointments = exports.addAppointmentToPatient = exports.deleteAppointment = exports.updateAppointment = exports.getAllAppointmentForPatient = void 0;
const appointment_1 = __importDefault(require("../models/appointment"));
const patient_1 = __importDefault(require("../models/patient"));
const getAllAppointmentForPatient = async (_req, _res) => {
    try {
        console.log(_req.params.patId);
        const appointments = await appointment_1.default.find({ patientId: _req.params.patId }).populate('patientId');
        if (!appointments) {
            _res.json("Appointments not found");
            _res.status(404);
            return;
        }
        _res.status(200).json(appointments);
    }
    catch (error) {
        console.log(`Error in retrieving all appointments for patient with ${_req.params.patId}`, error);
        _res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAllAppointmentForPatient = getAllAppointmentForPatient;
const updateAppointment = async (_req, _res) => {
    try {
        const updatedPost = await appointment_1.default.findByIdAndUpdate(_req.params.appointId, _req.body, { new: true }).populate('patientId');
        if (!updatedPost) {
            _res.status(404).json({ error: 'Appointment not found' });
            return;
        }
        _res.send(updatedPost);
        console.log(`Appointment with id ${_req.params.appointId} Updated from DB`);
    }
    catch (error) {
        _res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateAppointment = updateAppointment;
const deleteAppointment = async (_req, _res) => {
    try {
        const deletedPost = await appointment_1.default.findByIdAndDelete(_req.params.appointId, _req.body).populate('patientId');
        if (!deletedPost) {
            _res.status(404).json({ error: 'Appointment not found' });
            return;
        }
        _res.json({ message: 'Appointment deleted successfully' });
        console.log(`Appointment with id ${_req.params.appointId} Deleted from DB`);
    }
    catch (error) {
        _res.status(500).json({ error: 'Internal server error' });
    }
};
exports.deleteAppointment = deleteAppointment;
const addAppointmentToPatient = async (_req, _res) => {
    try {
        console.log('Request Body:', _req.body);
        const { patientId, ...appointmentData } = _req.body;
        const existingPatient = await patient_1.default.findById(patientId);
        if (!existingPatient) {
            return _res.status(404).json({ error: 'Patient not found' });
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
        _res.status(500).json({ error: 'Internal server error' });
    }
};
exports.addAppointmentToPatient = addAppointmentToPatient;
const getUnpaidAppointments = async (_req, _res) => {
    try {
        const unpaidAppointments = await appointment_1.default.find({ isPaid: false });
        if (unpaidAppointments.length === 0) {
            _res.status(404).json("There is no unpaid appointment");
            return;
        }
        console.log("Fetching Unpaid Appointments");
        _res.status(201).json(unpaidAppointments);
    }
    catch (error) {
        console.log('Error in finding unpaid appointment:', error);
        _res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getUnpaidAppointments = getUnpaidAppointments;
const getAppointmentsforDate = async (_req, _res) => {
    try {
        const requestedDate = new Date(_req.params.date);
        const startOfDay = new Date(requestedDate.getFullYear(), requestedDate.getMonth(), requestedDate.getDate());
        const endOfDay = new Date(startOfDay);
        endOfDay.setHours(23, 59, 59, 999);
        const appointments = await appointment_1.default.find({ startTime: { $gte: startOfDay, $lte: endOfDay } });
        if (!appointments || appointments.length === 0) {
            _res.status(404).json("There are no appointments for the given date");
            return;
        }
        _res.status(200).json(appointments);
    }
    catch (err) {
        console.log(`Error in getting all appointments for date ${_req.params.date}`, err);
        _res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAppointmentsforDate = getAppointmentsforDate;
const getRemainingBill = async (_req, _res) => {
    try {
        const unpaidSum = await appointment_1.default.aggregate([
            { $match: { isPaid: false } },
            { $group: { _id: null, total: { $sum: "$paymentAmount" } } }
        ]);
        if (!unpaidSum || unpaidSum.length === 0) {
            _res.status(404).json("There are no unpaid appointments, therefore remaining bill is NULL");
            return;
        }
        _res.status(200).json(`Total Remaining Bill ${unpaidSum[0].total}`);
        console.log(`Total Unpaid Sum is := ${unpaidSum[0].total}`);
    }
    catch (error) {
        console.log(`Error in getting appointments with remaining Bill : ${error}`);
        _res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getRemainingBill = getRemainingBill;
const getPopularPatient = async (_req, _res) => {
    try {
        const popularPatient = await appointment_1.default.aggregate([
            { $match: { isPaid: true } },
            {
                $group: {
                    _id: "$patientId", totalPayment: { $sum: "$paymentAmount" }
                }
            },
            { $sort: { totalPayment: -1 } },
            { $limit: 1 },
            { $lookup: { from: "patientCollection", localField: "_id", foreignField: "_id", as: "patient" } },
            { $unwind: { path: "$patient", preserveNullAndEmptyArrays: true } }
        ]);
        if (!popularPatient || popularPatient.length === 0) {
            _res.status(404).json("No Popular Patient found");
            return;
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
        _res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getPopularPatient = getPopularPatient;
const getAllAppointment = async (_req, res) => {
    console.log("getAllAppointment");
    try {
        const Appointment = await appointment_1.default.find();
        res.json(Appointment);
        console.log("Appointment Fetched from DB");
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAllAppointment = getAllAppointment;
const getAppointmentFinancials = async (_req, _res) => {
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
                            $cond: [{ $eq: ['$isPaid', true] }, '$paymentAmount', 0]
                        }
                    },
                    unpaidAmount: {
                        $sum: {
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
            _res.status(404).json("No financial data found");
            return;
        }
        console.log("Generating financial report of all Appointments");
        _res.status(200).json(result);
    }
    catch (error) {
        console.log(`Error in getting financial report: ${error}`);
        _res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAppointmentFinancials = getAppointmentFinancials;
