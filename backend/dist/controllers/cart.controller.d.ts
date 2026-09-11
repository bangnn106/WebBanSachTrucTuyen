import { Request, Response, NextFunction } from 'express';
export declare function getCart(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function addToCart(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateCartItem(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function removeFromCart(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function clearCart(req: Request, res: Response, next: NextFunction): Promise<void>;
