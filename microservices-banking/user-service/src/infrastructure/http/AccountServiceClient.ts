import axios from 'axios';

export interface AccountDTO {
  id: number;
  userId: number;
  accountNumber: string;
  balance: number | string;
  createdAt: Date;
  updatedAt: Date;
}

// Client HTTP pour communiquer avec le service de comptes
export class AccountServiceClient {
  private readonly baseUrl: string;

  constructor() {
    // En production, cette URL viendrait des variables d'environnement
    this.baseUrl = process.env.ACCOUNT_SERVICE_URL || 'http://account-service:3002';
  }

  async getAccountsByUserId(userId: number): Promise<AccountDTO[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/accounts/user/${userId}`);

      if (response.data.success) {
        return response.data.data;
      }

      return [];
    } catch (error: any) {
      console.error(`[AccountServiceClient] Erreur lors de la récupération des comptes pour l'utilisateur ${userId}:`, error.message);
      // En cas d'erreur, on retourne un tableau vide plutôt que de faire échouer toute la requête
      return [];
    }
  }
}
