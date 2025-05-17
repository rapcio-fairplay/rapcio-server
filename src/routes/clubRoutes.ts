import express from 'express';
import { createClub, getClubs, getClubById } from '../controllers/clubController';
import { auth, checkRole } from '../middlewares/auth';

const router = express.Router();

router.post('/', auth, checkRole(['ADMIN']), createClub);
router.get('/', auth, getClubs);
router.get('/:id', auth, getClubById);

export default router;
