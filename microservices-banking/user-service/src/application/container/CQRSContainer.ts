import { CreateUserCommand } from '../commands/CreateUserCommand';
import { UpdateUserCommand } from '../commands/UpdateUserCommand';
import { DeleteUserCommand } from '../commands/DeleteUserCommand';
import { GetUserByIdQuery } from '../queries/GetUserByIdQuery';
import { GetAllUsersQuery } from '../queries/GetAllUsersQuery';
import { GetUserWithAccountsQuery } from '../queries/GetUserWithAccountsQuery';
import { CreateUserHandler, UpdateUserHandler, DeleteUserHandler } from '../handlers/UserCommandHandlers';
import { GetUserByIdHandler, GetAllUsersHandler } from '../handlers/UserQueryHandlers';
import { GetUserWithAccountsHandler } from '../handlers/UserCompositeHandlers';
import { Mediator } from '../mediator/Mediator';
import { EventBus } from '../../infrastructure/messaging/EventBus';

export class CQRSContainer {
  private services = new Map<string, any>();
  private mediator: Mediator;

  constructor(private eventBus: EventBus) {
    this.registerServices();
    this.mediator = this.setupMediator();
  }

  private registerServices(): void {
    // Commands
    const createUserCommand = new CreateUserCommand();
    const updateUserCommand = new UpdateUserCommand();
    const deleteUserCommand = new DeleteUserCommand();

    this.services.set('CreateUserCommand', createUserCommand);
    this.services.set('UpdateUserCommand', updateUserCommand);
    this.services.set('DeleteUserCommand', deleteUserCommand);

    // Queries
    const getUserByIdQuery = new GetUserByIdQuery();
    const getAllUsersQuery = new GetAllUsersQuery();
    const getUserWithAccountsQuery = new GetUserWithAccountsQuery();

    this.services.set('GetUserByIdQuery', getUserByIdQuery);
    this.services.set('GetAllUsersQuery', getAllUsersQuery);
    this.services.set('GetUserWithAccountsQuery', getUserWithAccountsQuery);

    // Handlers (avec injection de l'EventBus pour les commandes)
    const createUserHandler = new CreateUserHandler(createUserCommand, this.eventBus);
    const updateUserHandler = new UpdateUserHandler(updateUserCommand);
    const deleteUserHandler = new DeleteUserHandler(deleteUserCommand, this.eventBus);
    const getUserByIdHandler = new GetUserByIdHandler(getUserByIdQuery);
    const getAllUsersHandler = new GetAllUsersHandler(getAllUsersQuery);
    const getUserWithAccountsHandler = new GetUserWithAccountsHandler(getUserWithAccountsQuery);

    this.services.set('CreateUserHandler', createUserHandler);
    this.services.set('UpdateUserHandler', updateUserHandler);
    this.services.set('DeleteUserHandler', deleteUserHandler);
    this.services.set('GetUserByIdHandler', getUserByIdHandler);
    this.services.set('GetAllUsersHandler', getAllUsersHandler);
    this.services.set('GetUserWithAccountsHandler', getUserWithAccountsHandler);
  }

  private setupMediator(): Mediator {
    const mediator = new Mediator();

    // Register handlers
    mediator.register('CreateUserRequest', this.get<CreateUserHandler>('CreateUserHandler'));
    mediator.register('UpdateUserRequest', this.get<UpdateUserHandler>('UpdateUserHandler'));
    mediator.register('DeleteUserRequest', this.get<DeleteUserHandler>('DeleteUserHandler'));
    mediator.register('GetUserByIdRequest', this.get<GetUserByIdHandler>('GetUserByIdHandler'));
    mediator.register('GetAllUsersRequest', this.get<GetAllUsersHandler>('GetAllUsersHandler'));
    mediator.register('GetUserWithAccountsRequest', this.get<GetUserWithAccountsHandler>('GetUserWithAccountsHandler'));

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

  getEventBus(): EventBus {
    return this.eventBus;
  }
}
