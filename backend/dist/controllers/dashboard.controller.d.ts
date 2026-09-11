import { Request, Response, NextFunction } from 'express';
export declare function getOverview(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getRevenue(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getTopBooks(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getOrderStats(req: Request, res: Response, next: NextFunction): Promise<void>;
