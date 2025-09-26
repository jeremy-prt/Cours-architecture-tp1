import express, { Request, Response } from 'express';
import { IUserService } from '../interfaces/IUserService';
import { container } from '../di/container';
import { syncDatabase } from '../models';
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from '../dtos/UserDTOs';
import { User } from '../models/User';

const router = express.Router();
const userService = container.get<IUserService>('IUserService');

syncDatabase();

// Helper function to convert User entity to UserResponseDTO
const toUserResponseDTO = (user: User): UserResponseDTO => ({
  id: user.id,
  nom: user.nom,
  prenom: user.prenom,
  email: user.email,
  telephone: user.telephone,
  profil: user.profil,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

router.post('/users', async (req: Request, res: Response) => {
  try {
    const createUserDTO: CreateUserDTO = req.body;
    const { nom, prenom, email, telephone } = createUserDTO;
    
    if (!nom || !prenom || !email || !telephone) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont obligatoires (nom, prenom, email, telephone)'
      });
    }

    const user = await userService.createUser({ nom, prenom, email, telephone });
    
    res.status(201).json({
      success: true,
      data: toUserResponseDTO(user)
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/users', async (_req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    
    res.json({
      success: true,
      data: users.map(toUserResponseDTO)
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(parseInt(id));
    
    res.json({
      success: true,
      data: toUserResponseDTO(user)
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

router.put('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateUserDTO: UpdateUserDTO = req.body;
    
    const updatedUser = await userService.updateUser(parseInt(id), updateUserDTO);
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    res.json({
      success: true,
      data: toUserResponseDTO(updatedUser)
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(parseInt(id));
    
    res.json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

export default router;