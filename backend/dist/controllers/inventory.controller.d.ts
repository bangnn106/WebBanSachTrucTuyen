import { Request, Response, NextFunction } from 'express';
export declare function importStock(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function adjustStock(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
