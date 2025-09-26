import { Request, Response } from 'express';
import { Mediator } from '../../application/mediator/Mediator';
import { 
  CreateUserRequest, 
  UpdateUserRequest, 
  DeleteUserRequest,
  GetUserByIdRequest,
  GetAllUsersRequest 
} from '../../application/requests/UserRequests';
import { CreateUserDTO, UpdateUserDTO } from '../../application/dtos/UserDTOs';

export class CQRSUserController {
  constructor(private mediator: Mediator) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const createUserDTO: CreateUserDTO = req.body;
      
      if (!createUserDTO.nom || !createUserDTO.prenom || !createUserDTO.email || !createUserDTO.telephone) {
        res.status(400).json({ success: false, message: 'Tous les champs sont obligatoires' });
        return;
      }

      const request = new CreateUserRequest(createUserDTO);
      const user = await this.mediator.send(request);
      
      res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      this.handleError(error, res, 400);
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const request = new GetAllUsersRequest();
      const users = await this.mediator.send(request);
      
      res.status(200).json({ success: true, data: users });
    } catch (error: any) {
      this.handleError(error, res, 500);
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'ID invalide' });
        return;
      }

      const request = new GetUserByIdRequest(id);
      const user = await this.mediator.send(request);
      
      if (!user) {
        res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        return;
      }
      
      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      this.handleError(error, res, 500);
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updateUserDTO: UpdateUserDTO = req.body;
      
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'ID invalide' });
        return;
      }

      if (!updateUserDTO.nom || !updateUserDTO.prenom || !updateUserDTO.email || !updateUserDTO.telephone) {
        res.status(400).json({ success: false, message: 'Tous les champs sont obligatoires' });
        return;
      }

      const request = new UpdateUserRequest(id, updateUserDTO);
      const user = await this.mediator.send(request);
      
      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      this.handleError(error, res, 400);
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'ID invalide' });
        return;
      }

      const request = new DeleteUserRequest(id);
      const success = await this.mediator.send(request);
      
      if (success) {
        res.status(200).json({ success: true, message: 'Utilisateur supprimé avec succès' });
      } else {
        res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
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