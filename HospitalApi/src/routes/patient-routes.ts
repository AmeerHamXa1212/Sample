import { Router } from 'express';
import * as PatientControllers from '../controllers/patient-controller'

const patientRouter = Router()

patientRouter.get('/patients',PatientControllers.getAllPatient)
patientRouter.delete('/patients/:patientId',PatientControllers.deletePatient)

patientRouter.post('/patients',PatientControllers.createPatient)
patientRouter.patch('/patients/:patientId',PatientControllers.updatePatient)

export default patientRouter