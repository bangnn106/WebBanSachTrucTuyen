import { Request, Response, NextFunction } from 'express';
export declare function roleMiddleware(...allowedRoles: string[]): (req: Request, res: Response, next: NextFunction) => void;
