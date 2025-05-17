import express from 'express';
import { createPlayer, getPlayers, getPlayerById } from '../controllers/playerController';
import { auth, checkRole } from '../middlewares/auth';

const router = express.Router();

router.post('/', auth, checkRole(['ADMIN']), createPlayer);
router.get('/', auth, getPlayers);
router.get('/:id', auth, getPlayerById);

export default router;
