import { Router } from 'express';
import { AuditController } from './audit-reporting.controller';

const router = Router();
//TODO: Add auth middleware

router.get('/stats', AuditController.getStats);
router.get('/grouped', AuditController.getGroupedAudits);
router.get('/standards', AuditController.getStandards);
router.get('/auditors', AuditController.getAuditors);
router.get('/:id', AuditController.getAudit);
router.post('/', AuditController.createAudit);

export default router;
