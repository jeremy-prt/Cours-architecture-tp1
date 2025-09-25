import sequelize from '../config/database';
import User from './User';

const syncDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données réussie.');
    
    await sequelize.sync({ force: false });
    console.log('Toutes les tables ont été synchronisées.');
  } catch (error) {
    console.error('Erreur de synchronisation de la base de données:', error);
  }
};

export { User, sequelize, syncDatabase };