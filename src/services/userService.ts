import userRepository from '../repositories/userRepository';
import { User, UserCreationAttributes } from '../models/User';

interface UserUpdateData {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
}

class UserService {
  assignProfile(email: string): 'Administrateur' | 'Utilisateur standard' {
    return email.endsWith('@company.com') ? 'Administrateur' : 'Utilisateur standard';
  }

  async createUser(userData: UserCreationAttributes): Promise<User> {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    const profil = this.assignProfile(userData.email);
    
    const userToCreate: UserCreationAttributes = {
      ...userData,
      profil
    };

    return await userRepository.create(userToCreate);
  }

  async getAllUsers(): Promise<User[]> {
    return await userRepository.findAll();
  }

  async getUserById(id: number): Promise<User> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    return user;
  }

  async updateUser(id: number, userData: UserUpdateData): Promise<User | null> {
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new Error('Utilisateur non trouvé');
    }

    const updateData: Partial<UserCreationAttributes> = { ...userData };

    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = await userRepository.findByEmail(userData.email);
      if (emailExists) {
        throw new Error('Un utilisateur avec cet email existe déjà');
      }
      updateData.profil = this.assignProfile(userData.email);
    }

    return await userRepository.update(id, updateData);
  }

  async deleteUser(id: number): Promise<boolean> {
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new Error('Utilisateur non trouvé');
    }

    return await userRepository.delete(id);
  }
}

export default new UserService();