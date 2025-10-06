import { CreateAccountCommand } from '../commands/CreateAccountCommand';
import { DeleteAccountCommand } from '../commands/DeleteAccountCommand';
import { GetAccountByIdQuery } from '../queries/GetAccountByIdQuery';
import { GetAllAccountsQuery } from '../queries/GetAllAccountsQuery';
import { GetAccountsByUserIdQuery } from '../queries/GetAccountsByUserIdQuery';
import { CreateAccountHandler, DeleteAccountHandler } from '../handlers/AccountCommandHandlers';
import { GetAccountByIdHandler, GetAllAccountsHandler, GetAccountsByUserIdHandler } from '../handlers/AccountQueryHandlers';
import { Mediator } from '../mediator/Mediator';

export class CQRSContainer {
  private services = new Map<string, any>();
  private mediator: Mediator;

  constructor() {
    this.registerServices();
    this.mediator = this.setupMediator();
  }

  private registerServices(): void {
    // Commands
    const createAccountCommand = new CreateAccountCommand();
    const deleteAccountCommand = new DeleteAccountCommand();

    this.services.set('CreateAccountCommand', createAccountCommand);
    this.services.set('DeleteAccountCommand', deleteAccountCommand);

    // Queries
    const getAccountByIdQuery = new GetAccountByIdQuery();
    const getAllAccountsQuery = new GetAllAccountsQuery();
    const getAccountsByUserIdQuery = new GetAccountsByUserIdQuery();

    this.services.set('GetAccountByIdQuery', getAccountByIdQuery);
    this.services.set('GetAllAccountsQuery', getAllAccountsQuery);
    this.services.set('GetAccountsByUserIdQuery', getAccountsByUserIdQuery);

    // Handlers
    const createAccountHandler = new CreateAccountHandler(createAccountCommand);
    const deleteAccountHandler = new DeleteAccountHandler(deleteAccountCommand);
    const getAccountByIdHandler = new GetAccountByIdHandler(getAccountByIdQuery);
    const getAllAccountsHandler = new GetAllAccountsHandler(getAllAccountsQuery);
    const getAccountsByUserIdHandler = new GetAccountsByUserIdHandler(getAccountsByUserIdQuery);

    this.services.set('CreateAccountHandler', createAccountHandler);
    this.services.set('DeleteAccountHandler', deleteAccountHandler);
    this.services.set('GetAccountByIdHandler', getAccountByIdHandler);
    this.services.set('GetAllAccountsHandler', getAllAccountsHandler);
    this.services.set('GetAccountsByUserIdHandler', getAccountsByUserIdHandler);
  }

  private setupMediator(): Mediator {
    const mediator = new Mediator();

    // Register handlers
    mediator.register('CreateAccountRequest', this.get<CreateAccountHandler>('CreateAccountHandler'));
    mediator.register('DeleteAccountRequest', this.get<DeleteAccountHandler>('DeleteAccountHandler'));
    mediator.register('GetAccountByIdRequest', this.get<GetAccountByIdHandler>('GetAccountByIdHandler'));
    mediator.register('GetAllAccountsRequest', this.get<GetAllAccountsHandler>('GetAllAccountsHandler'));
    mediator.register('GetAccountsByUserIdRequest', this.get<GetAccountsByUserIdHandler>('GetAccountsByUserIdHandler'));

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
