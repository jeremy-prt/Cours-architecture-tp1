import { IRequestHandler } from '../mediator/IRequest';
import { GetAccountByIdRequest, GetAllAccountsRequest, GetAccountsByUserIdRequest } from '../requests/AccountRequests';
import { GetAccountByIdQuery } from '../queries/GetAccountByIdQuery';
import { GetAllAccountsQuery } from '../queries/GetAllAccountsQuery';
import { GetAccountsByUserIdQuery } from '../queries/GetAccountsByUserIdQuery';
import { AccountResponseDTO } from '../dtos/AccountDTOs';

export class GetAccountByIdHandler implements IRequestHandler<GetAccountByIdRequest, AccountResponseDTO | null> {
  constructor(private getAccountByIdQuery: GetAccountByIdQuery) {}

  async handle(request: GetAccountByIdRequest): Promise<AccountResponseDTO | null> {
    return await this.getAccountByIdQuery.execute(request.id);
  }
}

export class GetAllAccountsHandler implements IRequestHandler<GetAllAccountsRequest, AccountResponseDTO[]> {
  constructor(private getAllAccountsQuery: GetAllAccountsQuery) {}

  async handle(request: GetAllAccountsRequest): Promise<AccountResponseDTO[]> {
    return await this.getAllAccountsQuery.execute();
  }
}

export class GetAccountsByUserIdHandler implements IRequestHandler<GetAccountsByUserIdRequest, AccountResponseDTO[]> {
  constructor(private getAccountsByUserIdQuery: GetAccountsByUserIdQuery) {}

  async handle(request: GetAccountsByUserIdRequest): Promise<AccountResponseDTO[]> {
    return await this.getAccountsByUserIdQuery.execute(request.userId);
  }
}
