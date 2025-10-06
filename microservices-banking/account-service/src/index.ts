import express from 'express';
import { config } from 'dotenv';
import { connectDatabase } from './config/database';
import { cqrsContainer } from './application/container/CQRSContainer';
import { CQRSAccountController } from './controllers/CQRSAccountController';
import { createCQRSAccountRoutes } from './routes/accountRoutes';
import { EventBus } from './infrastructure/messaging/EventBus';
import { AccountSaga } from './application/sagas/AccountSaga';

config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

// Démarrer le serveur
const startServer = async () => {
  await connectDatabase();

  // Initialiser l'Event Bus
  const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  const eventBus = new EventBus(rabbitmqUrl);
  await eventBus.connect();

  // Initialiser le Saga pour gérer les événements utilisateur
  const accountSaga = new AccountSaga(eventBus);
  await accountSaga.initialize();

  // Get mediator from CQRS container
  const mediator = cqrsContainer.getMediator();

  // Create CQRS controller
  const cqrsAccountController = new CQRSAccountController(mediator);

  // Setup routes
  app.use('/api', createCQRSAccountRoutes(cqrsAccountController));

  // Health check
  app.get('/health', (req, res) => {
    res.json({
      service: 'account-service',
      status: 'ok',
      architecture: 'CQRS + Saga Pattern',
      eventBus: 'RabbitMQ'
    });
  });

  app.listen(PORT, () => {
    console.log(`[Account Service CQRS + Saga] Serveur démarré sur le port ${PORT}`);
  });
};

startServer();
