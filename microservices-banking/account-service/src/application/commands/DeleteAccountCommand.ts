import Account from '../../models/Account';

export class DeleteAccountCommand {
  async execute(id: number): Promise<boolean> {
    const account = await Account.findByPk(id);
    if (!account) {
      throw new Error('Compte non trouvé');
    }

    await account.destroy();
    return true;
  }
}
