import User from '../../models/User';
import { AccountServiceClient, AccountDTO } from '../../infrastructure/http/AccountServiceClient';

export interface UserWithAccountsDTO {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  profil: string;
  accounts: AccountDTO[];
}

// Query composite qui agrège les données utilisateur et comptes
export class GetUserWithAccountsQuery {
  private accountServiceClient: AccountServiceClient;

  constructor() {
    this.accountServiceClient = new AccountServiceClient();
  }

  async execute(userId: number): Promise<UserWithAccountsDTO | null> {
    // Récupérer l'utilisateur depuis la DB locale
    const user = await User.findByPk(userId);

    if (!user) {
      return null;
    }

    // Appel HTTP au service de comptes pour récupérer les comptes de cet utilisateur
    const accounts = await this.accountServiceClient.getAccountsByUserId(userId);

    // Retourner l'agrégation
    return {
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone,
      profil: user.profil,
      accounts,
    };
  }
}
