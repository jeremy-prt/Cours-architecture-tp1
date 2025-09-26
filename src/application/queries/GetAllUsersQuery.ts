import { IUserRepository } from '../ports/IUserRepository';
import { UserMapper } from '../mapping/UserMapper';
import { UserResponseDTO } from '../dtos/UserDTOs';

export class GetAllUsersQuery {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => UserMapper.toResponseDTO(user));
  }
}