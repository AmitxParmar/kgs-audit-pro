"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
exports.authenticate = authenticate;
const supabase_1 = require("../config/supabase");
async function authenticate(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        res.status(401).json({ error: 'No token' });
        return;
    }
    const { data: { user }, error } = await supabase_1.supabaseAdmin.auth.getUser(token);
    if (error || !user) {
        res.status(401).json({ error: 'Invalid token' });
        return;
    }
    const { data: profile } = await supabase_1.supabaseAdmin
        .from('users')
        .select('role, cb_id, is_active')
        .eq('id', user.id)
        .single();
    if (!profile?.is_active) {
        res.status(403).json({ error: 'Account inactive' });
        return;
    }
    req.user = { id: user.id, email: user.email, role: profile.role, cb_id: profile.cb_id };
    next();
}
exports.authMiddleware = authenticate;
//# sourceMappingURL=auth.js.map