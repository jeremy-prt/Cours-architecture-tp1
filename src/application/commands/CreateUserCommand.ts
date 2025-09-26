import { IUserRepository } from '../ports/IUserRepository';
import { UserProfileService } from '../../domain/services/UserProfileService';
import { User } from '../../domain/entities/User';
import { UserMapper } from '../mapping/UserMapper';
import { CreateUserDTO, UserResponseDTO } from '../dtos/UserDTOs';

export class CreateUserCommand {
  constructor(
    private userRepository: IUserRepository,
    private userProfileService: UserProfileService
  ) {}

  async execute(createUserDTO: CreateUserDTO): Promise<UserResponseDTO> {
    const email = UserMapper.createEmailFromDTO(createUserDTO);
    
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    const user = User.create(
      createUserDTO.nom,
      createUserDTO.prenom,
      email,
      createUserDTO.telephone,
      this.userProfileService
    );

    const savedUser = await this.userRepository.save(user);
    return UserMapper.toResponseDTO(savedUser);
  }
}