import type { Request, Response, NextFunction } from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { prismaClient } from 'db/client';


declare global {
  namespace Express {
    interface Request {
      userId?: string;
      auth?: any; 
    }
  }
}


export const authMiddleWare = async (req: Request, res: Response, next: NextFunction) => {

  ClerkExpressRequireAuth()(req as any, res as any, async (error?: any) => {
    if (error) {
      res.status(401).json({ error: 'Authentication failed' });
      return;
    }
    
    try {
    
      const clerkUserId = req.auth?.userId;
      
      if (!clerkUserId) {
        res.status(401).json({ error: 'User ID not found' });
        return;
      }
      
      
      let user = await prismaClient.user.findUnique({
        where: { clerkId: clerkUserId }
      });
      
      if (!user) {
        
        const email = req.auth?.sessionClaims?.email || `${clerkUserId}@clerk.user`;
        
        user = await prismaClient.user.create({
          data: {
            clerkId: clerkUserId,
            email: email
          }
        });
      }
      
      
      req.userId = user.id;
      
      next();
      
    } catch (dbError) {
      console.error('Database error in auth middleware:', dbError);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  });
};


// import type{ NextFunction, Request, Response } from "express";
// import jwt from 'jsonwebtoken'
// import { JWT_PUBLIC_KEY } from "./config";
// const authMiddleWare = async(req: Request, res: Response, next: NextFunction) => {
//   const token = `Bearer + ${req.headers['authorization']}`;
//   if(!token){
//     return res.status(404).json({msg: "Unauthorized"});
//   }

//   const decode = jwt.verify(token, JWT_PUBLIC_KEY);
//   if(!decode || !decode.sub){
//     return res.status(404).json({msg: "Unauthorized"});
//   }

//   req.userId = decode.sub as string; 
//   next();
// }

// export { authMiddleWare };