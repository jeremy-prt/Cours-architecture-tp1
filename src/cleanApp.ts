import express, { Request, Response } from 'express';
import { cleanContainer } from './infrastructure/di/CleanArchitectureContainer';
import { UserController } from './presentation/controllers/UserController';
import { createUserRoutes } from './presentation/routes/userRoutes';
import { syncDatabase } from './models';

const app = express();

app.use(express.json());

// Initialize database
syncDatabase();

// Get controller from DI container
const userController = cleanContainer.get<UserController>('UserController');

// Setup routes
app.use('/api', createUserRoutes(userController));

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Clean Architecture API - Architecture TP1' });
});

export default app;