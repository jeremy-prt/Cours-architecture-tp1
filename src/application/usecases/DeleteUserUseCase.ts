import { UserId } from '../../domain/valueobjects/UserId';
import { IUserRepository } from '../ports/IUserRepository';

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: number): Promise<void> {
    const userId = new UserId(id);
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const deleted = await this.userRepository.delete(userId);
    if (!deleted) {
      throw new Error('Erreur lors de la suppression');
    }
  }
}