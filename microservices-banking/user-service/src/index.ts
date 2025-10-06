import express from 'express';
import { config } from 'dotenv';
import { connectDatabase } from './config/database';
import { CQRSContainer } from './application/container/CQRSContainer';
import { CQRSUserController } from './controllers/CQRSUserController';
import { createCQRSUserRoutes } from './routes/userRoutes';
import { EventBus } from './infrastructure/messaging/EventBus';
import { UserSaga } from './application/sagas/UserSaga';

config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Démarrer le serveur
const startServer = async () => {
  await connectDatabase();

  // Initialiser l'Event Bus
  const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  const eventBus = new EventBus(rabbitmqUrl);
  await eventBus.connect();

  // Créer le CQRS container avec l'EventBus
  const cqrsContainer = new CQRSContainer(eventBus);
  const mediator = cqrsContainer.getMediator();

  // Initialiser le Saga pour gérer les compensations
  const userSaga = new UserSaga(eventBus);
  await userSaga.initialize();

  // Create CQRS controller
  const cqrsUserController = new CQRSUserController(mediator);

  // Setup routes
  app.use('/api', createCQRSUserRoutes(cqrsUserController));

  // Health check
  app.get('/health', (req, res) => {
    res.json({
      service: 'user-service',
      status: 'ok',
      architecture: 'CQRS + Saga Pattern',
      eventBus: 'RabbitMQ'
    });
  });

  app.listen(PORT, () => {
    console.log(`[User Service CQRS + Saga] Serveur démarré sur le port ${PORT}`);
  });
};

startServer();
