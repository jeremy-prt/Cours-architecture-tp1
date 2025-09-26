// Clean Architecture DI Container

import { IUserRepository } from '../../application/ports/IUserRepository';
import { CreateUserUseCase } from '../../application/usecases/CreateUserUseCase';
import { GetAllUsersUseCase } from '../../application/usecases/GetAllUsersUseCase';
import { GetUserByIdUseCase } from '../../application/usecases/GetUserByIdUseCase';
import { UpdateUserUseCase } from '../../application/usecases/UpdateUserUseCase';
import { DeleteUserUseCase } from '../../application/usecases/DeleteUserUseCase';
import { UserProfileService } from '../../domain/services/UserProfileService';
import { SequelizeUserRepository } from '../persistence/SequelizeUserRepository';
import { UserController } from '../../presentation/controllers/UserController';

export class CleanArchitectureContainer {
  private services = new Map<string, any>();

  constructor() {
    this.registerServices();
  }

  private registerServices(): void {
    // Domain Services (singleton)
    const userProfileService = new UserProfileService();
    this.services.set('UserProfileService', userProfileService);

    // Infrastructure (scoped/transient)
    const userRepository: IUserRepository = new SequelizeUserRepository();
    this.services.set('IUserRepository', userRepository);

    // Application Use Cases (scoped)
    const createUserUseCase = new CreateUserUseCase(userRepository, userProfileService);
    this.services.set('CreateUserUseCase', createUserUseCase);

    const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
    this.services.set('GetAllUsersUseCase', getAllUsersUseCase);

    const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
    this.services.set('GetUserByIdUseCase', getUserByIdUseCase);

    const updateUserUseCase = new UpdateUserUseCase(userRepository, userProfileService);
    this.services.set('UpdateUserUseCase', updateUserUseCase);

    const deleteUserUseCase = new DeleteUserUseCase(userRepository);
    this.services.set('DeleteUserUseCase', deleteUserUseCase);

    // Presentation Controllers (scoped)
    const userController = new UserController(
      createUserUseCase,
      getAllUsersUseCase,
      getUserByIdUseCase,
      updateUserUseCase,
      deleteUserUseCase
    );
    this.services.set('UserController', userController);
  }

  get<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return service;
  }
}

export const cleanContainer = new CleanArchitectureContainer();