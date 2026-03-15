"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.get('/', auth_1.authMiddleware, controller_1.getAudits);
router.post('/', auth_1.authMiddleware, controller_1.createAudit);
router.get('/:id', auth_1.authMiddleware, controller_1.getAuditById);
router.put('/:id', auth_1.authMiddleware, controller_1.updateAudit);
exports.default = router;
//# sourceMappingURL=routes.js.map