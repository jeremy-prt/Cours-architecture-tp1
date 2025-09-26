import { User, UserCreationAttributes } from '../models/User';

export interface UserUpdateData {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
}

export interface IUserService {
  assignProfile(email: string): 'Administrateur' | 'Utilisateur standard';
  createUser(userData: UserCreationAttributes): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getUserById(id: number): Promise<User>;
  updateUser(id: number, userData: UserUpdateData): Promise<User | null>;
  deleteUser(id: number): Promise<boolean>;
}