import { User, UserCreationAttributes } from '../models/User';

export interface IUserRepository {
  create(userData: UserCreationAttributes): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: number, userData: Partial<UserCreationAttributes>): Promise<User | null>;
  delete(id: number): Promise<boolean>;
}