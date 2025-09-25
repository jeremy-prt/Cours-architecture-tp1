import express, { Request, Response } from 'express';
import userService from '../services/userService';
import { syncDatabase } from '../models';

const router = express.Router();

syncDatabase();

router.post('/users', async (req: Request, res: Response) => {
  try {
    const { nom, prenom, email, telephone } = req.body;
    
    if (!nom || !prenom || !email || !telephone) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont obligatoires (nom, prenom, email, telephone)'
      });
    }

    const user = await userService.createUser({ nom, prenom, email, telephone });
    
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    
    res.json({
      success: true,
      data: users
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
      data: user
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
    const { nom, prenom, email, telephone } = req.body;
    
    const updatedUser = await userService.updateUser(parseInt(id), { nom, prenom, email, telephone });
    
    res.json({
      success: true,
      data: updatedUser
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