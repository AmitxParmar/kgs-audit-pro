// apps/server/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string; role: string; cb_id: string };
    }
  }
}



export async function authenticate(
  req: Request, res: Response, next: NextFunction
): Promise<void> {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    res.status(401).json({ error: 'No token' });
    return;
  }

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  // Pull role + cb_id from our users table (not just JWT claims)
  const { data: profile } = await supabaseAdmin
    .from('users')
    .select('role, cb_id, is_active')
    .eq('id', user.id)
    .single();

  if (!profile?.is_active) {
    res.status(403).json({ error: 'Account inactive' });
    return;
  }

  req.user = { id: user.id, email: user.email!, role: profile.role, cb_id: profile.cb_id };
  next();
}

export const authMiddleware = authenticate;