import { Router } from 'express';
import { CQRSAccountController } from '../controllers/CQRSAccountController';

export function createCQRSAccountRoutes(controller: CQRSAccountController): Router {
  const router = Router();

  // Commands (Write operations)
  router.post('/accounts', (req, res) => controller.createAccount(req, res));
  router.delete('/accounts/:id', (req, res) => controller.deleteAccount(req, res));

  // Queries (Read operations)
  router.get('/accounts', (req, res) => controller.getAllAccounts(req, res));
  router.get('/accounts/:id', (req, res) => controller.getAccountById(req, res));
  router.get('/accounts/user/:userId', (req, res) => controller.getAccountsByUserId(req, res));

  return router;
}
