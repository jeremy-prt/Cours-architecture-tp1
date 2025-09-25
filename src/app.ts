import express, { Request, Response } from 'express';
import userRoutes from './routes/users';

const app = express();

app.use(express.json());

app.use('/api', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API de gestion d\'utilisateurs - Architecture TP1' });
});

export default app;