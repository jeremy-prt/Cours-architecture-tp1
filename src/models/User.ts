import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface UserAttributes {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  profil: 'Administrateur' | 'Utilisateur standard';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'profil' | 'createdAt' | 'updatedAt'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public nom!: string;
  public prenom!: string;
  public email!: string;
  public telephone!: string;
  public profil!: 'Administrateur' | 'Utilisateur standard';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profil: {
    type: DataTypes.ENUM('Administrateur', 'Utilisateur standard'),
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'users',
  timestamps: true,
  modelName: 'User'
});

export default User;