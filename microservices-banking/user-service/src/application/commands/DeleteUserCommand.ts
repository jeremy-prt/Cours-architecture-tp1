import User from '../../models/User';

export class DeleteUserCommand {
  async execute(id: number): Promise<boolean> {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    await user.destroy();
    return true;
  }
}
