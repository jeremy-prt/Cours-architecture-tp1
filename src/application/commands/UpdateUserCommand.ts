import { IUserRepository } from '../ports/IUserRepository';
import { UserProfileService } from '../../domain/services/UserProfileService';
import { UserId } from '../../domain/valueobjects/UserId';
import { UserMapper } from '../mapping/UserMapper';
import { UpdateUserDTO, UserResponseDTO } from '../dtos/UserDTOs';

export class UpdateUserCommand {
  constructor(
    private userRepository: IUserRepository,
    private userProfileService: UserProfileService
  ) {}

  async execute(id: number, updateUserDTO: UpdateUserDTO): Promise<UserResponseDTO> {
    const userId = new UserId(id);
    const existingUser = await this.userRepository.findById(userId);
    
    if (!existingUser) {
      throw new Error('Utilisateur non trouvé');
    }

    // Update personal info if provided
    if (updateUserDTO.nom || updateUserDTO.prenom || updateUserDTO.telephone) {
      existingUser.updatePersonalInfo(updateUserDTO.nom, updateUserDTO.prenom, updateUserDTO.telephone);
    }

    // Update email if provided (this will also update profile)
    if (updateUserDTO.email) {
      const newEmail = UserMapper.createEmailFromDTO({ email: updateUserDTO.email } as any);
      existingUser.updateEmail(newEmail, this.userProfileService);
    }

    const savedUser = await this.userRepository.save(existingUser);
    return UserMapper.toResponseDTO(savedUser);
  }
}