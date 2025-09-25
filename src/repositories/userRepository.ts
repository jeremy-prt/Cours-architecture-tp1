import { User, UserAttributes, UserCreationAttributes } from '../models/User';

class UserRepository {
  async create(userData: UserCreationAttributes): Promise<User> {
    return await User.create(userData);
  }

  async findAll(): Promise<User[]> {
    return await User.findAll();
  }

  async findById(id: number): Promise<User | null> {
    return await User.findByPk(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  async update(id: number, userData: Partial<UserCreationAttributes>): Promise<User | null> {
    const [updatedRowsCount] = await User.update(userData, {
      where: { id },
      returning: true
    });
    
    if (updatedRowsCount === 0) {
      return null;
    }
    
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const deletedRowsCount = await User.destroy({
      where: { id }
    });
    
    return deletedRowsCount > 0;
  }
}

export default new UserRepository();