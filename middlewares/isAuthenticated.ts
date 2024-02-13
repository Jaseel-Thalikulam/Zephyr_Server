import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'


interface CustomRequest extends Request {
    userId?: string; 
}

export function isAuthenticated(req: CustomRequest, res: Response, next: NextFunction) {
    try {
        let tokenWithBearer = req.get("authorization");
        if (!tokenWithBearer) {
            return res.status(401).json({ success: false, message: "Token not found" });
        }
        const token = tokenWithBearer.split(" ")[1];
        
        const decoded = jwt.verify(token, "mySecretKey");

        if (typeof decoded !== 'string' && decoded.userId) {
            
            req.userId = (decoded as { userId: string }).userId;

        } else {
            
            return res.status(401).json({ success: false, message: "Unauthorized" });
    
        }

        next();

    } catch (error) {
        console.error(error);
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    
}