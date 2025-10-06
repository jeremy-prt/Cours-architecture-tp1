import Account from '../../models/Account';
import { CreateAccountDTO, AccountResponseDTO } from '../dtos/AccountDTOs';

const generateAccountNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ACC${timestamp}${random}`;
};

export class CreateAccountCommand {
  async execute(dto: CreateAccountDTO): Promise<AccountResponseDTO> {
    const accountNumber = generateAccountNumber();

    const account = await Account.create({
      userId: dto.userId,
      accountNumber,
      balance: dto.balance || 0.00
    });

    return account.toJSON() as AccountResponseDTO;
  }
}
