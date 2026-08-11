import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { z, ZodSchema, AnyZodObject } from 'zod';

// Middleware to check if user has one ot the allowed roles

export const requireRole = (allowedRoles : string | string[]) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  return (req: AuthRequest, res: Response, next: NextFunction) => {
   
    if (!req.user){
      return res.status (401).json({
         success : false,
         message: 'Unauthorized',
      });
    }
  if (!roles.includes(req.user.role)) {
    console.warn (
      `[AUTHZ DENIED] user =${req.user.userId} role=${req.user.role} required =[${roles.join(',')}]`
    );
    return res.status(403).json({
      success: false,
      message: 'Forbidden:Insufficient permissions',
    });
  }
  next();
 };
};
 
// Backward-compatible alias for existing routes using requireAdmin
// Prefer requireRole ('admin') or requireRole (['admin', ...]) for new code

export const requireAdmin = requireRole('admin');

// Validate and sanitize request body against a Zod schema
// Rejects request with missing/invalid fields (400, with details)
// Strips any fields not defined in the schema (preventing unexpected parameters from leaking into the handler)

export const validateBody = <T extends AnyZodObject> (schema: T) => {
  return ( req : AuthRequest, res: Response, next: NextFunction) => {
    const result = schema.strict().safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request parameters',
        errors: result.error.issues.map(issue => ({
            field: issue.path.join('.'),
          message: issue.message
        }))
      })
    }
    // attach the validated/transformed data back to the request (useful for defaultValues)
    req.body = result.data;
    next();
  };
};


// Legacy field-prsence check, kept for any routes not yet migrated to zod
// Prefer validateBody over validate
// not just presence , validateBody also 

export const validateAdminRequest = ( requiredFields: string[]) => {
  return (req : AuthRequest, res: Response, next: NextFunction) => {
    const missing = requiredFields.filter (field => {
      const value = req.body?.[field];
      return value === undefined || value === null || value === '';
    });

    if (missing.length > 0 ) {
      return res.status(400).json ({
        success: false,
        message: `Missing required fields: ${missing.join(',')}`,
      });
    }
    
    next();
  };

};

 




