import { Request, Response, NextFunction } from 'express';

export const checkWRK = (req: Request, res: Response, next: NextFunction): void => {
  const value = req.headers['mc-load-test'];
  if (value === 'WRK') next();
  else res.sendStatus(401);
};
