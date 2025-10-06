import { IRequest } from '../mediator/IRequest';
import { CreateAccountDTO, AccountResponseDTO } from '../dtos/AccountDTOs';

// Commands (Write operations)
export class CreateAccountRequest implements IRequest<AccountResponseDTO> {
  constructor(public readonly data: CreateAccountDTO) {}
}

export class DeleteAccountRequest implements IRequest<boolean> {
  constructor(public readonly id: number) {}
}

// Queries (Read operations)
export class GetAccountByIdRequest implements IRequest<AccountResponseDTO | null> {
  constructor(public readonly id: number) {}
}

export class GetAllAccountsRequest implements IRequest<AccountResponseDTO[]> {
  // No parameters
}

export class GetAccountsByUserIdRequest implements IRequest<AccountResponseDTO[]> {
  constructor(public readonly userId: number) {}
}
