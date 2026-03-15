import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { getAudits, createAudit, getAuditById, updateAudit } from './controller';

const router = Router();

router.get('/', authMiddleware, getAudits);
router.post('/', authMiddleware, createAudit);
router.get('/:id', authMiddleware, getAuditById);
router.put('/:id', authMiddleware, updateAudit);

export default router;