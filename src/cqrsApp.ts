import express, { Request, Response } from 'express';
import { cqrsContainer } from './infrastructure/di/CQRSContainer';
import { CQRSUserController } from './presentation/controllers/CQRSUserController';
import { createCQRSUserRoutes } from './presentation/routes/cqrsUserRoutes';
import { syncDatabase } from './models';

const app = express();

app.use(express.json());

// Initialize database
syncDatabase();

// Get mediator from CQRS container
const mediator = cqrsContainer.getMediator();

// Create CQRS controller
const cqrsUserController = new CQRSUserController(mediator);

// Setup routes
app.use('/api', createCQRSUserRoutes(cqrsUserController));

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'CQRS Architecture API - Architecture TP1' });
});

export default app;