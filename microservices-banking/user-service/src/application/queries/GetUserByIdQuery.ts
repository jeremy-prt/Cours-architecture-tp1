import User from '../../models/User';
import { UserResponseDTO } from '../dtos/UserDTOs';

export class GetUserByIdQuery {
  async execute(id: number): Promise<UserResponseDTO | null> {
    const user = await User.findByPk(id);
    return user ? (user.toJSON() as UserResponseDTO) : null;
  }
}
