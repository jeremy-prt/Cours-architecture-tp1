import { IRequestHandler } from '../mediator/IRequest';
import { CreateAccountRequest, DeleteAccountRequest } from '../requests/AccountRequests';
import { CreateAccountCommand } from '../commands/CreateAccountCommand';
import { DeleteAccountCommand } from '../commands/DeleteAccountCommand';
import { AccountResponseDTO } from '../dtos/AccountDTOs';

export class CreateAccountHandler implements IRequestHandler<CreateAccountRequest, AccountResponseDTO> {
  constructor(private createAccountCommand: CreateAccountCommand) {}

  async handle(request: CreateAccountRequest): Promise<AccountResponseDTO> {
    return await this.createAccountCommand.execute(request.data);
  }
}

export class DeleteAccountHandler implements IRequestHandler<DeleteAccountRequest, boolean> {
  constructor(private deleteAccountCommand: DeleteAccountCommand) {}

  async handle(request: DeleteAccountRequest): Promise<boolean> {
    return await this.deleteAccountCommand.execute(request.id);
  }
}
