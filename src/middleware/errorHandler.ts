import { Request, Response, NextFunction } from 'express';

export const errorHandler = (error: any, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';
  res.status(statusCode).json({ error: message });
};
