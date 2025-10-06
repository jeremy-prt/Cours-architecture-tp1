import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface AccountAttributes {
  id?: number;
  userId: number;
  accountNumber: string;
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Account extends Model<AccountAttributes> implements AccountAttributes {
  public id!: number;
  public userId!: number;
  public accountNumber!: string;
  public balance!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Account.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    accountNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    }
  },
  {
    sequelize,
    tableName: 'accounts',
    timestamps: true
  }
);

export default Account;
