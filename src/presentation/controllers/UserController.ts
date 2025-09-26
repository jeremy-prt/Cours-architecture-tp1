import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../application/usecases/CreateUserUseCase';
import { GetAllUsersUseCase } from '../../application/usecases/GetAllUsersUseCase';
import { GetUserByIdUseCase } from '../../application/usecases/GetUserByIdUseCase';
import { UpdateUserUseCase } from '../../application/usecases/UpdateUserUseCase';
import { DeleteUserUseCase } from '../../application/usecases/DeleteUserUseCase';
import { CreateUserDTO, UpdateUserDTO } from '../../application/dtos/UserDTOs';

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private getAllUsersUseCase: GetAllUsersUseCase,
    private getUserByIdUseCase: GetUserByIdUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase
  ) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const createUserDTO: CreateUserDTO = req.body;
      const user = await this.createUserUseCase.execute(createUserDTO);
      
      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error: any) {
      this.handleError(error, res, 400);
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.getAllUsersUseCase.execute();
      
      res.json({
        success: true,
        data: users
      });
    } catch (error: any) {
      this.handleError(error, res, 500);
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const user = await this.getUserByIdUseCase.execute(id);
      
      res.json({
        success: true,
        data: user
      });
    } catch (error: any) {
      this.handleError(error, res, 404);
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updateUserDTO: UpdateUserDTO = req.body;
      const user = await this.updateUserUseCase.execute(id, updateUserDTO);
      
      res.json({
        success: true,
        data: user
      });
    } catch (error: any) {
      this.handleError(error, res, 400);
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.deleteUserUseCase.execute(id);
      
      res.json({
        success: true,
        message: 'Utilisateur supprimé avec succès'
      });
    } catch (error: any) {
      this.handleError(error, res, 404);
    }
  }

  private handleError(error: Error, res: Response, defaultStatus: number): void {
    let status = defaultStatus;
    
    // Map specific errors to HTTP status codes
    if (error.message.includes('non trouvé')) {
      status = 404;
    } else if (error.message.includes('existe déjà')) {
      status = 409;
    } else if (error.message.includes('obligatoire') || error.message.includes('invalide')) {
      status = 400;
    }
    
    res.status(status).json({
      success: false,
      message: error.message
    });
  }
}