import User from '../../models/User';
import { CreateUserDTO, UserResponseDTO } from '../dtos/UserDTOs';

export class CreateUserCommand {
  async execute(dto: CreateUserDTO): Promise<UserResponseDTO> {
    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    // Déterminer le profil basé sur le domaine email
    let profil: 'Administrateur' | 'Utilisateur standard' = 'Utilisateur standard';
    if (dto.email.endsWith('@company.com')) {
      profil = 'Administrateur';
    }

    const user = await User.create({
      nom: dto.nom,
      prenom: dto.prenom,
      email: dto.email,
      telephone: dto.telephone,
      profil
    });

    return user.toJSON() as UserResponseDTO;
  }
}
