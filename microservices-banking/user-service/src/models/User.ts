import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface UserAttributes {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  profil: 'Administrateur' | 'Utilisateur standard';
  createdAt?: Date;
  updatedAt?: Date;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public nom!: string;
  public prenom!: string;
  public email!: string;
  public telephone!: string;
  public profil!: 'Administrateur' | 'Utilisateur standard';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    prenom: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    telephone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    profil: {
      type: DataTypes.ENUM('Administrateur', 'Utilisateur standard'),
      allowNull: false,
      defaultValue: 'Utilisateur standard'
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true
  }
);

export default User;
