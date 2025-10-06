import { Request, Response } from 'express';
import { Mediator } from '../application/mediator/Mediator';
import {
  CreateAccountRequest,
  DeleteAccountRequest,
  GetAccountByIdRequest,
  GetAllAccountsRequest,
  GetAccountsByUserIdRequest
} from '../application/requests/AccountRequests';
import { CreateAccountDTO } from '../application/dtos/AccountDTOs';

export class CQRSAccountController {
  constructor(private mediator: Mediator) {}

  async createAccount(req: Request, res: Response): Promise<void> {
    try {
      const createAccountDTO: CreateAccountDTO = req.body;

      if (!createAccountDTO.userId) {
        res.status(400).json({ success: false, message: 'userId est obligatoire' });
        return;
      }

      const request = new CreateAccountRequest(createAccountDTO);
      const account = await this.mediator.send(request);

      res.status(201).json({ success: true, data: account });
    } catch (error: any) {
      this.handleError(error, res, 400);
    }
  }

  async getAllAccounts(req: Request, res: Response): Promise<void> {
    try {
      const request = new GetAllAccountsRequest();
      const accounts = await this.mediator.send(request);

      res.status(200).json({ success: true, data: accounts });
    } catch (error: any) {
      this.handleError(error, res, 500);
    }
  }

  async getAccountById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'ID invalide' });
        return;
      }

      const request = new GetAccountByIdRequest(id);
      const account = await this.mediator.send(request);

      if (!account) {
        res.status(404).json({ success: false, message: 'Compte non trouvé' });
        return;
      }

      res.status(200).json({ success: true, data: account });
    } catch (error: any) {
      this.handleError(error, res, 500);
    }
  }

  async getAccountsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        res.status(400).json({ success: false, message: 'userId invalide' });
        return;
      }

      const request = new GetAccountsByUserIdRequest(userId);
      const accounts = await this.mediator.send(request);

      res.status(200).json({ success: true, data: accounts });
    } catch (error: any) {
      this.handleError(error, res, 500);
    }
  }

  async deleteAccount(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'ID invalide' });
        return;
      }

      const request = new DeleteAccountRequest(id);
      const success = await this.mediator.send(request);

      if (success) {
        res.status(200).json({ success: true, message: 'Compte supprimé avec succès' });
      } else {
        res.status(404).json({ success: false, message: 'Compte non trouvé' });
      }
    } catch (error: any) {
      this.handleError(error, res, 400);
    }
  }

  private handleError(error: any, res: Response, defaultStatus: number): void {
    console.error('Error:', error.message);
    res.status(defaultStatus).json({
      success: false,
      message: error.message || 'Erreur interne du serveur'
    });
  }
}
