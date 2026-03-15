"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../../middleware/auth");
const rbac_1 = require("../../middleware/rbac");
const controller_1 = require("./controller");
const uploadMiddleware = (0, multer_1.default)({ storage: multer_1.default.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });
const router = (0, express_1.Router)();
router.post('/upload', auth_1.authMiddleware, (0, rbac_1.requirePermission)('documents', 'create'), uploadMiddleware.single('file'), controller_1.upload);
router.post('/link', auth_1.authMiddleware, (0, rbac_1.requirePermission)('documents', 'create'), controller_1.addExternalLink);
router.get('/master-list', auth_1.authMiddleware, (0, rbac_1.requirePermission)('documents', 'read'), controller_1.getMasterList);
router.get('/:id/signed-url', auth_1.authMiddleware, (0, rbac_1.requirePermission)('documents', 'read'), controller_1.getSignedUrl);
router.delete('/:id', auth_1.authMiddleware, (0, rbac_1.requirePermission)('documents', 'delete'), controller_1.softDelete);
router.post('/:id/restore', auth_1.authMiddleware, (0, rbac_1.requirePermission)('documents', 'delete'), controller_1.restore);
router.get('/recycle-bin', auth_1.authMiddleware, (0, rbac_1.requirePermission)('documents', 'delete'), controller_1.getRecycleBin);
exports.default = router;
//# sourceMappingURL=routes.js.map