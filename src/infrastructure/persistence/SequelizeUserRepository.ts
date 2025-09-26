import { IUserRepository } from '../../application/ports/IUserRepository';
import { User } from '../../domain/entities/User';
import { UserId } from '../../domain/valueobjects/UserId';
import { Email } from '../../domain/valueobjects/Email';
import { UserProfile } from '../../domain/valueobjects/UserProfile';
import { User as SequelizeUser } from '../../models/User'; // ORM model

export class SequelizeUserRepository implements IUserRepository {
  async save(user: User): Promise<User> {
    const userData = {
      nom: user.getNom(),
      prenom: user.getPrenom(),
      email: user.getEmail().toString(),
      telephone: user.getTelephone(),
      profil: user.getProfil() as 'Administrateur' | 'Utilisateur standard'
    };

    if (user.getId()) {
      // Update existing
      await SequelizeUser.update(userData, {
        where: { id: user.getId()!.toNumber() }
      });
      const updatedUser = await SequelizeUser.findByPk(user.getId()!.toNumber());
      if (!updatedUser) {
        throw new Error('Utilisateur non trouvé après mise à jour');
      }
      return this.toDomainEntity(updatedUser);
    } else {
      // Create new
      const savedUser = await SequelizeUser.create(userData);
      return this.toDomainEntity(savedUser);
    }
  }

  async findById(id: UserId): Promise<User | null> {
    const sequelizeUser = await SequelizeUser.findByPk(id.toNumber());
    return sequelizeUser ? this.toDomainEntity(sequelizeUser) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const sequelizeUser = await SequelizeUser.findOne({
      where: { email: email.toString() }
    });
    return sequelizeUser ? this.toDomainEntity(sequelizeUser) : null;
  }

  async findAll(): Promise<User[]> {
    const sequelizeUsers = await SequelizeUser.findAll();
    return sequelizeUsers.map(user => this.toDomainEntity(user));
  }

  async delete(id: UserId): Promise<boolean> {
    const deletedCount = await SequelizeUser.destroy({
      where: { id: id.toNumber() }
    });
    return deletedCount > 0;
  }

  async exists(email: Email): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }

  private toDomainEntity(sequelizeUser: SequelizeUser): User {
    return User.fromPersistence(
      sequelizeUser.id,
      sequelizeUser.nom,
      sequelizeUser.prenom,
      sequelizeUser.email,
      sequelizeUser.telephone,
      sequelizeUser.profil,
      sequelizeUser.createdAt,
      sequelizeUser.updatedAt
    );
  }
}