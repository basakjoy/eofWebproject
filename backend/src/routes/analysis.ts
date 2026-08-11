import { Router, Response, NextFunction } from "express";
import { verifyToken, AuthRequest }  from "../middleware/auth";
import { z } from "zod";
import { title } from "process";
import { validate } from "uuid";


const router = Router();

// Validation schemas

const createAnalysisSchema = z.object({
    title : z.string().min(1).max(200),
    content:z.string().min(1),
    
})
.strict();

const updateAnalysisSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    content: z.string().min(1).optional(),
    publish: z.boolean().optional(),
    
})
.strict();


const addCommentSchema = z.object ({
  text: z.string().min(1).max(2000),
})
.strict();

const IdParamSchema = z.object({
  id: z.string().min(1, 'id is required'),
});


// middleware

const validateBody = (schema: z.ZodTypeAny) => {
  return ( req: AuthRequest, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if(!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map((e) => `${e.path.join('.')}:  ${e.message}`),
      })
    }
    req.body = result.data;  // pass the validated data to the next middleware/handler
    next();
  };
};


// Validate request parameters (URL segments)
const validateParams = (schema: z.ZodTypeAny) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        
      });
    }
    next();
  };
};

// TODO OWNERSHIP CHECK 
// ONCE WIRED TO PRISMA, PUT/DELETE
// TP CONFIRM THE ANAYSIS AT :ID BELONGS TO REQ.USER.USERID

const requireOwnership = async (req: AuthRequest, res: Response, next: NextFunction) => {
  next();
};


// Get /api/analysis - get all analyses
router.get('/', verifyToken, (req: AuthRequest, res: Response)=> {
  res.json({ success: true, message: "analysis found", data: [] });
});



//POST /api/analysis/:id - get single analysis
router.get("/:id", verifyToken,
  validateBody(createAnalysisSchema),
 (req: AuthRequest, res: Response) => {
  res.json({ success: true, message:'Analysis created'});
 }
);

// GET / API/ANALYSIS/:ID
router.get ('/', verifyToken, validateParams(IdParamSchema),requireOwnership,
(req: AuthRequest, res: Response) => {
  res.json({ success: true, data:{} });
}
);



// Put / api/analysis/:id
router.put('/ :id', verifyToken, validateParams(IdParamSchema),requireOwnership,
validateBody(updateAnalysisSchema), (req: AuthRequest, res: Response) => {
  res.json({success: true, message: "Analysis updated"});
});


// Delete /api/analysis/:id
router.delete('/:id', verifyToken, validateParams(IdParamSchema),requireOwnership, (req: AuthRequest, res: Response) => {
  res.json({success: true, message: "Analysis deleted"});
});


//Post/ api/ analysis/:id/comments

router.post('/:id/comments', verifyToken, validateParams(IdParamSchema),requireOwnership,
(req: AuthRequest, res: Response) => {
  res.json({success: true, message: "Comment added"});
});

// Put /api/analysis/:id/comments/:commentId

router.put('/:id/comments/:commentId', verifyToken, validateParams(IdParamSchema),requireOwnership,
(req: AuthRequest, res: Response) => {
  res.json({success: true, message: "Comment updated"});
});


// Delete /api/analysis/:id/comments/:commentId

router.delete('/:id/comments/:commentId', verifyToken, validateParams(IdParamSchema),requireOwnership,
(req: AuthRequest, res: Response) => {
  res.json({success: true, message: "Comment deleted"});
});


export default router;  



 