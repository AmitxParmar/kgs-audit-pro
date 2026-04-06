import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { getClients, createClient, getClientById, updateClient, updateApplicationStage, createContract } from './controller';

const router = Router();

router.get('/', getClients);
router.post('/', authMiddleware, createClient);
router.get('/:id', authMiddleware, getClientById);
router.put('/:id', authMiddleware, updateClient);
router.put('/application/:id/status', authMiddleware, updateApplicationStage);
router.post("/contract", authMiddleware, createContract);

export default router;
