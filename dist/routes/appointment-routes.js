"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AppointmentControllers = __importStar(require("../controllers/appointment-controller"));
const appointmentRouter = (0, express_1.Router)();
appointmentRouter.get('/appointments/:patId', AppointmentControllers.getAllAppointmentForPatient);
appointmentRouter.patch('/appointments/:appointId', AppointmentControllers.updateAppointment);
appointmentRouter.delete('/appointments/:appointId', AppointmentControllers.deleteAppointment);
appointmentRouter.post('/appointments', AppointmentControllers.addAppointmentToPatient);
appointmentRouter.get('/appointments', AppointmentControllers.getUnpaidAppointments);
appointmentRouter.get('/appointments/date/:date', AppointmentControllers.getAppointmentsforDate);
appointmentRouter.get('/unpaidappointments', AppointmentControllers.getRemainingBill);
appointmentRouter.get('/popularPatient', AppointmentControllers.getPopularPatient);
appointmentRouter.get('/allAppointments', AppointmentControllers.getAllAppointment);
appointmentRouter.get('/financialReport', AppointmentControllers.getAppointmentFinancials);
exports.default = appointmentRouter;
