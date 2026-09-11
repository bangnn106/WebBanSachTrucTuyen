import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../models/user.model';
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
export declare function authMiddleware(req: Request, res: Response, next: NextFunction): void;
