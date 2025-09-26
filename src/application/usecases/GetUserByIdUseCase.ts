import { UserId } from '../../domain/valueobjects/UserId';
import { IUserRepository } from '../ports/IUserRepository';
import { UserResponseDTO } from '../dtos/UserDTOs';
import { UserMapper } from '../mapping/UserMapper';

export class GetUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: number): Promise<UserResponseDTO> {
    const userId = new UserId(id);
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return UserMapper.toResponseDTO(user);
  }
}