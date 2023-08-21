import { Router } from 'express';
import AppointmentRoutes from './appointment-routes';
import PatientRoutes from './patient-routes'

const router = Router();

router.use(AppointmentRoutes,PatientRoutes);

export default router;