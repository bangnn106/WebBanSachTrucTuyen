import { Request, Response, NextFunction } from 'express';
export declare function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function toggleUserStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
