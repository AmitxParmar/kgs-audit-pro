// apps/server/src/modules/accreditation/routes.ts
import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '../../middleware/auth';
import { requirePermission } from '../../middleware/rbac';
import { upload, addExternalLink, getMasterList, getSignedUrl, softDelete, restore, getRecycleBin } from './controller';

const uploadMiddleware = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });
const router = Router();

// Repository operations — no review/approval routes needed
router.post('/upload',         authMiddleware, requirePermission('documents', 'create'),  uploadMiddleware.single('file'), upload);
router.post('/link',           authMiddleware, requirePermission('documents', 'create'),  addExternalLink);
router.get('/master-list',     authMiddleware, requirePermission('documents', 'read'),    getMasterList);
router.get('/:id/signed-url',  authMiddleware, requirePermission('documents', 'read'),    getSignedUrl);
router.delete('/:id',          authMiddleware, requirePermission('documents', 'delete'),  softDelete);
router.post('/:id/restore',    authMiddleware, requirePermission('documents', 'delete'),  restore);
router.get('/recycle-bin',     authMiddleware, requirePermission('documents', 'delete'),  getRecycleBin);

export default router;