import express from 'express';
import { login, registerAdmin, registerReferee } from '../controllers/userController';
import { auth, checkRole } from '../middlewares/auth';

const router = express.Router();

// Auth routes
router.post('/login', login);
router.post('/signup/admin', auth, checkRole(['SUPER_ADMIN']), registerAdmin);
router.post('/signup/referee', auth, checkRole(['ADMIN']), registerReferee);

export default router;
