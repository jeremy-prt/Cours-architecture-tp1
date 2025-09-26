import { User } from '../../domain/entities/User';
import { UserId } from '../../domain/valueobjects/UserId';
import { Email } from '../../domain/valueobjects/Email';

export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findAll(): Promise<User[]>;
  delete(id: UserId): Promise<boolean>;
  exists(email: Email): Promise<boolean>;
}