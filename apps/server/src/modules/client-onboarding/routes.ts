import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { getClients, createClient, getClientById, updateClient } from './controller';

const router = Router();

router.get('/', getClients);
router.post('/', authMiddleware, createClient);
router.get('/:id', authMiddleware, getClientById);
router.put('/:id', authMiddleware, updateClient);

export default router;
