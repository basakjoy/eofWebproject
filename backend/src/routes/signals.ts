import express, { Request, Response, NextFunction } from 'express';
import { prisma } from '../database';
import { v4 as uuidv4 } from 'uuid';
import {  z } from "zod";


const router = express.Router();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

interface ErrorResponse {
  success: false;
  message: string;  
  details?: string;
}

interface SuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
  total?: number;
  limit?: number;
  offset?: number;
}

// Validation schemas
const createSignalSchema =z.object ({
  pair: z.string().min(3).max(20).toUpperCase(),
  type: z.enum(['BUY', 'SELL']),
  direction: z.enum(['BUY', 'SELL']).optional(),
  entryPrice: z.number().positive('Entry price must be positive'),
  stopLoss: z.number().positive('Stop loss must be positive'),
  takeProfit: z.number().positive('Take profit must be positive'),
  takeProfits: z.array(z.number().positive()).max(3).optional(),
  accuracy: z.number().min(0).max(100).optional(),
  reliability: z.number().min(0).max(1).optional(),
  timeframe: z.string().max(10).optional().default('4H'),
  status: z.enum(['active', 'closed', 'pending']).optional().default('active'),
});

const updateSignalSchema = createSignalSchema.partial();

const querySchema = z.object({
  status: z.string().optional(),
  pair: z.string().optional(),
  type: z.enum(['BUY', 'SELL']).optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset:z.coerce.number().min(0).default(0),
});

// Middleware
// Validate request data against schema

const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if ( error instanceof z.ZodError ) {
        const messages = error.errors.map (e => '${e.path.join(',')} : ${e.message}');

        return res.status (400).json ({
          success: false,
          message: "Valition failed",
          details: messages.join (' ,'),
        } as ErrorResponse);
      }
      next(error);
    }
  };
};



// VaLidate query parameters

const validateQuery = (Schema: z.ZodSchema) => {
  return (req: Request, res:Response, next: NextFunction) => {
    try {
      req.query = Schema.parse(req.query) as any;
      next();
    } catch (error) {
      if ( error instanceof z.ZodError) {
        const messages = error.errors.map (e => '${e.path.join(',')): ${e.message}');
        return res.status(400).json ({
          success: false,
          message:"Invalid query parameters",
          details: messages.join(' ,'),
        } as ErrorResponse);
      }
      next (error);
    }
  };
};

// Verify authentication (admin only )
const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !=='admin') {
    return res.status(401).json ({
      success: false,
      message:'Unauthorized : Admin access required',
    } as ErrorResponse);
  } next();
};

// Validate uuid format

const isValidUUID = (id : string ) : boolean => {
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
return uuidRegex.test(id);
};

// Sanitize signal data for response

const sanitizeSignal = (signal: any) => {
  return {
    id: signal.id,
    pair: signal.pair,
    type: signal.type,
    direction: signal.direction,
    entryPrice: parseFloat(signal.entryPrice),
    stopLoss: parseFloat(signal.stoploss),
    takeProfit: signal.takeProfit ? parseFloat(signal.takeProfit) : null,
    takeProfits: [
      signal.takeProfit1 ? parseFloat(signal.takeProfit1) : null,
      signal.takeProfit2 ? parseFloat(signal.takeProfit2) : null,
      signal.takeProfit3 ? parseFloat(signal.takeProfit3) : null,
       ].filter(Boolean),

       accuracy: parseFloat (signal.accuracy),
       reliability: parseFloat(signal.reliability),
       timeframe: signal.timeframe,
       status: signal.status,
       createdAt: signal.createdAt,
       updateAt: signal.updatedAt,
  };
};

// Routes
// GET/signals
router.get ('/', validateQuery (querySchema),
async (req: AuthRequest, res: Response) => {
  try {
    const { status, pair, type, limit, offset } = req.query as any;

    // Build where filter
    const where: any = {};
    if (status) where.status = status;
    if ( pair ) where.pair = {contains: pair, mode: 'insensitive'};
    if (type) where.type = type;
    //  Fetch signals with pegination

    const [signals, total] = await Promise.all ([
      prisma.signal.findMany ({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc'},
        select: {
          id: true,
          pair: true,
          type: true,
          direction: true,
          entryPrice: true,
          stopLoss: true,
          takeProfit:true,
          takeProfit1: true,
          takeProfit2: true,
          takeProfit3: true,
          accuracy: true,
          reliability: true,
          timeframe: true,
          status: true,
          createdAt:true,
          updatedAt: true,
        },

      }),
      prisma.signal.count({ where },)
    ]);


    // Sanititize and format response
    const sanitized = signals.map(sanitizeSignal);

    return res.json({
      success: true,
      data: sanitized,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
     } as SuccessResponse<any[]> & {hasMore: boolean});  
   } catch (error : any) {
    console.error('Error fetching signals:', error);
    return res.status(500).json({
      success: false,
      message:'Failed to fetch signals',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    } as ErrorResponse);
   }
 }
);




// Get signal by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
 
    // Validate UUID format
    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid signal ID format',
      } as ErrorResponse);
    }
 
    const signal = await prisma.signal.findUnique({
      where: { id },
      select: {
        id: true,
        pair: true,
        type: true,
        direction: true,
        entryPrice: true,
        stopLoss: true,
        takeProfit: true,
        takeProfit1: true,
        takeProfit2: true,
        takeProfit3: true,
        accuracy: true,
        reliability: true,
        timeframe: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
 
    if (!signal) {
      return res.status(404).json({
        success: false,
        message: 'Signal not found',
      } as ErrorResponse);
    }
 
    return res.json({
      success: true,
      data: sanitizeSignal(signal),
    } as SuccessResponse<any>);
  } catch (error: any) {
    console.error('Error fetching signal:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch signal',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    } as ErrorResponse);
  }
});

// Post /signals (Create trading signal)
router.post ('/', requireAuth, validateRequest (createSignalSchema),
async (req: AuthRequest, res:Response) => {
  try {
    const {
      pair,
      type,
      direction,
      entryPrice,
      stopLoss,
      takeProfit,
      takeProfits,
      accuracy,
      reliability,
      timeframe,
      status


    } = req.body;

    // Logic validation 

    if (entryPrice <= stopLoss ) {
      return res.status (400).json ({
        success: false,
        message: 'Entry price must be greater than stop loss',
      } as ErrorResponse);
    }

    if (takeProfit &&
      type === 'BUY' &&
      takeProfit <= entryPrice
    ) {
      return res.status(400).json ({
        success: false,
        message:' Take profit must be less than entry price for SELL oders',
      } as ErrorResponse);
    }
    // Take profit values
     let tp1 = takeProfit || null;
     let tp2 = null;
     let tp3 = null;

     if (Array.isArray (takeProfit) && takeProfits.lenth > 0) {
      tp1 = takeProfits[0] || tp1;
      tp2 = takeProfits[1] || null;
      tp3 = takeProfits[2] || null;
    }

    const signalId = uuidv4();

    // Create signal in database
    const signal = await prisma.signal.create ({
    data: {
        id: signalId,
        pair,
        type,
        direction: direction || 'BUY',
        entryPrice: String(entryPrice),
        stopLoss: String (stopLoss),
        takeProfit: tp1 ? String(tp1) : null,
        takeProfit1: tp1 ? String(tp1): null,
        takeProfit2: tp2 ? String(tp2): null,
        takeProfit3: tp3 ? String(tp3) : null,
        accuracy: String( reliability || 0.85),
        timeframe,
        status,
      },
      select: {
        id: true,
        pair: true,
        type: true,
        direction: true,
        entryPrice: true,
        stopLoss: true,
        takeProfit: true,
        takeProfit1: true,
        takeProfit2: true,
        takeProfit3: true,
        accuracy: true,
        reliability: true,
        timeframe: true,
        status: true,
        createdAt:true,
        updatedAt: true,
      },
    });
   return res.status(201).json ({
    success: true,
    message: 'Signal created successfully',
    data: sanitizeSignal(signal),
   }as SuccessResponse<any>);

  } catch (error:any) {
    console.error('Error creating signal:', error);


    // Handle unique constraint violations

    if (error.code === 'P2002') {
      return res.status(409).json ({
        success: false,
        message:'Signal with this ID already exists',
      } as ErrorResponse);
    }

    return res.status(500).json({
      success: false,
      message:'Failed to create signal',
      details: process.env.NODE_ENV === 'development' ? error.message: undefined,
    } as ErrorResponse);
  }
}
);

// Put /signals/:id
// Update an existing signals
router.put(
  '/:id',
  requireAuth,
  validateRequest(updateSignalSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
 
      // Validate UUID format
      if (!isValidUUID(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid signal ID format',
        } as ErrorResponse);
      }
 
      const {
        status,
        reliability,
        accuracy,
        direction,
        pair,
        type,
        entryPrice,
        stopLoss,
        takeProfit,
        takeProfits,
        timeframe,
      } = req.body;
 
      // Fetch existing signal
      const signal = await prisma.signal.findUnique({
        where: { id },
      });
 
      if (!signal) {
        return res.status(404).json({
          success: false,
          message: 'Signal not found',
        } as ErrorResponse);
      }
 
      // Prevent updating closed signals
      if (signal.status === 'closed' && status !== 'closed') {
        return res.status(400).json({
          success: false,
          message: 'Cannot update a closed signal',
        } as ErrorResponse);
      }
 
      // Build update data
      const updateData: any = {};
      if (status !== undefined) updateData.status = status;
      if (reliability !== undefined) updateData.reliability = String(reliability);
      if (accuracy !== undefined) updateData.accuracy = String(accuracy);
      if (direction !== undefined) updateData.direction = direction;
      if (pair !== undefined) updateData.pair = pair;
      if (type !== undefined) updateData.type = type;
      if (entryPrice !== undefined) updateData.entryPrice = String(entryPrice);
      if (stopLoss !== undefined) updateData.stopLoss = String(stopLoss);
      if (timeframe !== undefined) updateData.timeframe = timeframe;
 
      // Handle multiple take profits
      if (takeProfits !== undefined && Array.isArray(takeProfits)) {
        if (takeProfits[0]) {
          updateData.takeProfit = String(takeProfits[0]);
          updateData.takeProfit1 = String(takeProfits[0]);
        }
        if (takeProfits[1]) updateData.takeProfit2 = String(takeProfits[1]);
        if (takeProfits[2]) updateData.takeProfit3 = String(takeProfits[2]);
      } else if (takeProfit !== undefined) {
        updateData.takeProfit = String(takeProfit);
        updateData.takeProfit1 = String(takeProfit);
      }
 
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No fields provided for update',
        } as ErrorResponse);
      }
 
      // Update signal
      await prisma.signal.update({
        where: { id },
        data: updateData,
      });
 
      return res.json({
        success: true,
        message: 'Signal updated successfully',
      } as SuccessResponse<null>);
    } catch (error: any) {
      console.error('Error updating signal:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update signal',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      } as ErrorResponse);
    }
  }
);

// Delete/ signals/ :id
// Delete a signal

router.delete('/:id', requireAuth, async (req : AuthRequest, res: Response)=> {
  try {
    const { id } = req.params;

    // Validate uuid format
    if (!isValidUUID (id)) {
      return res.status (400).json ({
        success: false,
        message: 'Invalid signal ID formar',
      } as ErrorResponse);
    }

    const signal = await prisma.signal.findUnique({
      where: {id},
    });

    if (!signal) {
      return res. status(404).json ({
      success: false,
      message:'Signal not found',
    } as ErrorResponse);
    }
    await prisma.signal.delete ({
      where: { id },
    });
    return res.json ({
      success: true,
      message: 'Signal deleted successfully',
    } as SuccessResponse <null>);

  } catch (error: any) {
    console.error ('Error deleting signal:', error);
    return res.status(500).json ({
      success: false,
      message: 'Failed to delete signal',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    } as ErrorResponse);
  }
});

// Put /signals/:id/close
// Close a signal (mark as closed)

router.put ('/:id/close', requireAuth, async (req: AuthRequest, res: Response)=> {
  try {
    const { id } = req.params;

    // Validate uuid format
    if (!isValidUUID(id)){
      return res.status(400).json({
        success: false,
        message: 'Invalid signal ID format',
      } as ErrorResponse);
    }
    const signal = await prisma.signal.findUnique ({
      where : { id },
    });

    if(!signal) {
    return res.status(404).json({
      success: false,
      message:'Signal not found',
    }as ErrorResponse);
  }

  await prisma.signal.update ({
    where: { id },
    data: { status: 'closed'},
  });

  return res.json ({
    success: true,
    message:'Signal closed successfully',
  } as SuccessResponse<null>);
 } catch (error: any) {
  console.error('Error closing signal:', error);
  return res.status(500).json({
    success: false,
    message:'Failed to close signal',
    details: process.env.NODE_ENV === 'development'? error.message: undefined,
  } as ErrorResponse);
 }
});


// Get/signals/stats
// GET signals statistics
router.get ('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const [ activeCount, closedCount, buyCount, sellCount ] = await Promise.all ([
      prisma.signal.count({ where : { status : 'active'}}),
      prisma.signal.count ({ where: { status : 'closed'}}),
      prisma.signal.count ({ where: { status : 'BUY'}}),
      prisma.signal.count ({ where: { status : 'SELL'}}),
      
    ]);

    
    const stats ={
      activeSignals: activeCount,
      closedSignals: closedCount,
      buySignals: buyCount,
      sellSignals: sellCount,
      totalSignals: activeCount + closedCount,
      winRate : activeCount + closedCount > 0 ? ((activeCount / (activeCount + closedCount)) * 100 ).toFixed(2) : '0.00',
     };

     return res.json ({
      success: true,
      data: stats,
     } as SuccessResponse<any>);
  } catch (error: any) {
    console.error('Error fetching signal stats:', error);
    return res.status(500).json ({
      success: false,
      message: 'Failed to fetch signal statistics',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }as ErrorResponse);
  }
});

export default router;





