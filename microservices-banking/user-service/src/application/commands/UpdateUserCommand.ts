import User from '../../models/User';
import { UpdateUserDTO, UserResponseDTO } from '../dtos/UserDTOs';

export class UpdateUserCommand {
  async execute(id: number, dto: UpdateUserDTO): Promise<UserResponseDTO> {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Déterminer le profil si l'email change
    let profil = user.profil;
    if (dto.email && dto.email !== user.email) {
      profil = dto.email.endsWith('@company.com') ? 'Administrateur' : 'Utilisateur standard';
    }

    await user.update({
      nom: dto.nom || user.nom,
      prenom: dto.prenom || user.prenom,
      email: dto.email || user.email,
      telephone: dto.telephone || user.telephone,
      profil
    });

    return user.toJSON() as UserResponseDTO;
  }
}
