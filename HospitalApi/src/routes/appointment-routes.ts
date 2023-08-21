import { Router } from 'express';
import * as AppointmentControllers from '../controllers/appointment-controller'

const appointmentRouter = Router()

appointmentRouter.get('/appointments/:patId',AppointmentControllers.getAllAppointmentForPatient)
appointmentRouter.patch('/appointments/:appointId',AppointmentControllers.updateAppointment)
appointmentRouter.delete('/appointments/:appointId',AppointmentControllers.deleteAppointment)
appointmentRouter.post('/appointments',AppointmentControllers.addAppointmentToPatient)
appointmentRouter.get('/appointments',AppointmentControllers.getUnpaidAppointments)
appointmentRouter.get('/appointments/date/:date',AppointmentControllers.getAppointmentsforDate)
appointmentRouter.get('/unpaidappointments',AppointmentControllers.getRemainingBill)
appointmentRouter.get('/popularPatient',AppointmentControllers.getPopularPatient)
appointmentRouter.get('/allAppointments',AppointmentControllers.getAllAppointment)
appointmentRouter.get('/financialReport',AppointmentControllers.getAppointmentFinancials)

export default appointmentRouter