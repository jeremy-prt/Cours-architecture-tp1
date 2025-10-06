import Account from '../../models/Account';
import { AccountResponseDTO } from '../dtos/AccountDTOs';

export class GetAccountsByUserIdQuery {
  async execute(userId: number): Promise<AccountResponseDTO[]> {
    const accounts = await Account.findAll({ where: { userId } });
    return accounts.map(account => account.toJSON() as AccountResponseDTO);
  }
}
