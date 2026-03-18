"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseAdmin = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const env_1 = require("./env");
const supabaseUrl = env_1.env.SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = env_1.env.SUPABASE_SERVICE_ROLE_KEY || 'development_key';
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
exports.supabaseAdmin = exports.supabase;
//# sourceMappingURL=supabase.js.map