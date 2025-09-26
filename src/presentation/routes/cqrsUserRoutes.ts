import { Router } from 'express';
import { CQRSUserController } from '../controllers/CQRSUserController';

export function createCQRSUserRoutes(controller: CQRSUserController): Router {
  const router = Router();

  // Commands (Write operations)
  router.post('/users', (req, res) => controller.createUser(req, res));
  router.put('/users/:id', (req, res) => controller.updateUser(req, res));
  router.delete('/users/:id', (req, res) => controller.deleteUser(req, res));

  // Queries (Read operations)
  router.get('/users', (req, res) => controller.getAllUsers(req, res));
  router.get('/users/:id', (req, res) => controller.getUserById(req, res));

  return router;
}