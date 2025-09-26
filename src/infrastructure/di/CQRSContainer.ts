import { IUserRepository } from '../../application/ports/IUserRepository';
import { UserProfileService } from '../../domain/services/UserProfileService';
import { SequelizeUserRepository } from '../persistence/SequelizeUserRepository';

import { CreateUserCommand } from '../../application/commands/CreateUserCommand';
import { UpdateUserCommand } from '../../application/commands/UpdateUserCommand';
import { DeleteUserCommand } from '../../application/commands/DeleteUserCommand';

import { GetUserByIdQuery } from '../../application/queries/GetUserByIdQuery';
import { GetAllUsersQuery } from '../../application/queries/GetAllUsersQuery';

import { CreateUserHandler, UpdateUserHandler, DeleteUserHandler } from '../../application/handlers/UserCommandHandlers';
import { GetUserByIdHandler, GetAllUsersHandler } from '../../application/handlers/UserQueryHandlers';

import { Mediator } from '../../application/mediator/Mediator';

export class CQRSContainer {
  private services = new Map<string, any>();
  private mediator: Mediator;

  constructor() {
    this.registerServices();
    this.mediator = this.setupMediator();
  }

  private registerServices(): void {
    // Domain Services
    const userProfileService = new UserProfileService();
    this.services.set('UserProfileService', userProfileService);

    // Infrastructure
    const userRepository: IUserRepository = new SequelizeUserRepository();
    this.services.set('IUserRepository', userRepository);

    // Commands
    const createUserCommand = new CreateUserCommand(userRepository, userProfileService);
    const updateUserCommand = new UpdateUserCommand(userRepository, userProfileService);
    const deleteUserCommand = new DeleteUserCommand(userRepository);

    this.services.set('CreateUserCommand', createUserCommand);
    this.services.set('UpdateUserCommand', updateUserCommand);
    this.services.set('DeleteUserCommand', deleteUserCommand);

    // Queries
    const getUserByIdQuery = new GetUserByIdQuery(userRepository);
    const getAllUsersQuery = new GetAllUsersQuery(userRepository);

    this.services.set('GetUserByIdQuery', getUserByIdQuery);
    this.services.set('GetAllUsersQuery', getAllUsersQuery);

    // Handlers
    const createUserHandler = new CreateUserHandler(createUserCommand);
    const updateUserHandler = new UpdateUserHandler(updateUserCommand);
    const deleteUserHandler = new DeleteUserHandler(deleteUserCommand);
    const getUserByIdHandler = new GetUserByIdHandler(getUserByIdQuery);
    const getAllUsersHandler = new GetAllUsersHandler(getAllUsersQuery);

    this.services.set('CreateUserHandler', createUserHandler);
    this.services.set('UpdateUserHandler', updateUserHandler);
    this.services.set('DeleteUserHandler', deleteUserHandler);
    this.services.set('GetUserByIdHandler', getUserByIdHandler);
    this.services.set('GetAllUsersHandler', getAllUsersHandler);
  }

  private setupMediator(): Mediator {
    const mediator = new Mediator();

    // Register handlers with proper typing
    mediator.register('CreateUserRequest', this.get<CreateUserHandler>('CreateUserHandler'));
    mediator.register('UpdateUserRequest', this.get<UpdateUserHandler>('UpdateUserHandler'));
    mediator.register('DeleteUserRequest', this.get<DeleteUserHandler>('DeleteUserHandler'));
    mediator.register('GetUserByIdRequest', this.get<GetUserByIdHandler>('GetUserByIdHandler'));
    mediator.register('GetAllUsersRequest', this.get<GetAllUsersHandler>('GetAllUsersHandler'));

    return mediator;
  }

  get<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return service;
  }

  getMediator(): Mediator {
    return this.mediator;
  }
}

export const cqrsContainer = new CQRSContainer();