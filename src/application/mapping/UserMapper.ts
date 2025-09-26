import { User } from '../../domain/entities/User';
import { Email } from '../../domain/valueobjects/Email';
import { UserResponseDTO, CreateUserDTO } from '../dtos/UserDTOs';

export class UserMapper {
  static toResponseDTO(user: User): UserResponseDTO {
    return {
      id: user.getId()?.toNumber() || 0,
      nom: user.getNom(),
      prenom: user.getPrenom(),
      email: user.getEmail().toString(),
      telephone: user.getTelephone(),
      profil: user.getProfil(),
      createdAt: user.getCreatedAt() || new Date(),
      updatedAt: user.getUpdatedAt() || new Date()
    };
  }

  static createEmailFromDTO(dto: CreateUserDTO | { email: string }): Email {
    return new Email(dto.email);
  }

  static toResponseDTOList(users: User[]): UserResponseDTO[] {
    return users.map(user => this.toResponseDTO(user));
  }
}