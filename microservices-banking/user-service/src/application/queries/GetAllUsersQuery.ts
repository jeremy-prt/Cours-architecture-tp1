import User from '../../models/User';
import { UserResponseDTO } from '../dtos/UserDTOs';

export class GetAllUsersQuery {
  async execute(): Promise<UserResponseDTO[]> {
    const users = await User.findAll();
    return users.map(user => user.toJSON() as UserResponseDTO);
  }
}
