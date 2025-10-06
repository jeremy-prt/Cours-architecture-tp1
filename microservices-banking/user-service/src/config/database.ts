import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: false
  }
);

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('[User Service] Connexion à la base de données réussie');
    await sequelize.sync();
    console.log('[User Service] Tables synchronisées');
  } catch (error) {
    console.error('[User Service] Erreur de connexion:', error);
    process.exit(1);
  }
};

export default sequelize;
