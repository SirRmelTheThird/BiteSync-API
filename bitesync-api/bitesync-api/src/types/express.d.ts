/**
 * Augments Express's Request type with the fields our auth middleware
 * attaches. Without this, every controller downstream of requireAuth
 * would need an `as any` or a manual cast to read req.userId.
 */
declare namespace Express {
  export interface Request {
    userId?: string;
  }
}
