import Account from '../../models/Account';
import { AccountResponseDTO } from '../dtos/AccountDTOs';

export class GetAccountByIdQuery {
  async execute(id: number): Promise<AccountResponseDTO | null> {
    const account = await Account.findByPk(id);
    return account ? (account.toJSON() as AccountResponseDTO) : null;
  }
}
