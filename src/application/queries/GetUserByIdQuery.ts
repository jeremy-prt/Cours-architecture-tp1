import { IUserRepository } from '../ports/IUserRepository';
import { UserId } from '../../domain/valueobjects/UserId';
import { UserMapper } from '../mapping/UserMapper';
import { UserResponseDTO } from '../dtos/UserDTOs';

export class GetUserByIdQuery {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: number): Promise<UserResponseDTO | null> {
    const userId = new UserId(id);
    const user = await this.userRepository.findById(userId);
    
    return user ? UserMapper.toResponseDTO(user) : null;
  }
}