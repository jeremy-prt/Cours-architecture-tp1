import { IUserRepository } from '../ports/IUserRepository';
import { UserId } from '../../domain/valueobjects/UserId';

export class DeleteUserCommand {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: number): Promise<boolean> {
    const userId = new UserId(id);
    const existingUser = await this.userRepository.findById(userId);
    
    if (!existingUser) {
      throw new Error('Utilisateur non trouvé');
    }

    return await this.userRepository.delete(userId);
  }
}