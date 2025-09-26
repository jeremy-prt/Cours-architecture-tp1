import { User } from '../../domain/entities/User';
import { Email } from '../../domain/valueobjects/Email';
import { UserProfileService } from '../../domain/services/UserProfileService';
import { IUserRepository } from '../ports/IUserRepository';
import { CreateUserDTO, UserResponseDTO } from '../dtos/UserDTOs';
import { UserMapper } from '../mapping/UserMapper';

export class CreateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private userProfileService: UserProfileService
  ) {}

  async execute(createUserDTO: CreateUserDTO): Promise<UserResponseDTO> {
    // Validations
    if (!createUserDTO.nom || !createUserDTO.prenom || !createUserDTO.email || !createUserDTO.telephone) {
      throw new Error('Tous les champs sont obligatoires');
    }

    const email = UserMapper.createEmailFromDTO(createUserDTO);

    // Business rule: Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    // Create domain entity
    const user = User.create(
      createUserDTO.nom,
      createUserDTO.prenom,
      email,
      createUserDTO.telephone,
      this.userProfileService
    );

    // Save and return
    const savedUser = await this.userRepository.save(user);
    return UserMapper.toResponseDTO(savedUser);
  }
}