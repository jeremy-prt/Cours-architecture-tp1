import { IUserRepository } from '../ports/IUserRepository';
import { UserResponseDTO } from '../dtos/UserDTOs';
import { UserMapper } from '../mapping/UserMapper';

export class GetAllUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.findAll();
    return UserMapper.toResponseDTOList(users);
  }
}