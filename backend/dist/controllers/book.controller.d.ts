import { Request, Response, NextFunction } from 'express';
export declare function searchBooks(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getBookById(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function createBook(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateBook(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateBookStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getCategories(_req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getPublishers(_req: Request, res: Response, next: NextFunction): Promise<void>;
