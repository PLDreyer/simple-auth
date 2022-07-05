import express, { Request, Response } from 'express';
import { GeneralGuard } from '@simple-auth/express';

const router = express.Router();

router.get('/me', GeneralGuard(), (req: Request, res: Response) => {
  return res.json(req.user);
});

export default router;
