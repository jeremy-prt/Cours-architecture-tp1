import { UserId } from '../../domain/valueobjects/UserId';
import { Email } from '../../domain/valueobjects/Email';
import { UserProfileService } from '../../domain/services/UserProfileService';
import { IUserRepository } from '../ports/IUserRepository';
import { UpdateUserDTO, UserResponseDTO } from '../dtos/UserDTOs';
import { UserMapper } from '../mapping/UserMapper';

export class UpdateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private userProfileService: UserProfileService
  ) {}

  async execute(id: number, updateUserDTO: UpdateUserDTO): Promise<UserResponseDTO> {
    const userId = new UserId(id);
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Handle email change (affects profile)
    if (updateUserDTO.email && updateUserDTO.email !== user.getEmail().toString()) {
      const newEmail = new Email(updateUserDTO.email);
      
      // Check if new email already exists
      const existingUser = await this.userRepository.findByEmail(newEmail);
      if (existingUser && !existingUser.getId()?.equals(userId)) {
        throw new Error('Un utilisateur avec cet email existe déjà');
      }
      
      user.updateEmail(newEmail, this.userProfileService);
    }

    // Handle other personal info updates
    if (updateUserDTO.nom || updateUserDTO.prenom || updateUserDTO.telephone) {
      user.updatePersonalInfo(
        updateUserDTO.nom,
        updateUserDTO.prenom,
        updateUserDTO.telephone
      );
    }

    const savedUser = await this.userRepository.save(user);
    return UserMapper.toResponseDTO(savedUser);
  }
}