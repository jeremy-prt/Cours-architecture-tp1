import Account from '../../models/Account';
import { AccountResponseDTO } from '../dtos/AccountDTOs';

export class GetAllAccountsQuery {
  async execute(): Promise<AccountResponseDTO[]> {
    const accounts = await Account.findAll();
    return accounts.map(account => account.toJSON() as AccountResponseDTO);
  }
}
