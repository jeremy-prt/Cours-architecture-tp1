import { IRequestHandler } from '../mediator/IRequest';
import { CreateUserRequest, UpdateUserRequest, DeleteUserRequest } from '../requests/UserRequests';
import { CreateUserCommand } from '../commands/CreateUserCommand';
import { UpdateUserCommand } from '../commands/UpdateUserCommand';
import { DeleteUserCommand } from '../commands/DeleteUserCommand';
import { UserResponseDTO } from '../dtos/UserDTOs';

export class CreateUserHandler implements IRequestHandler<CreateUserRequest, UserResponseDTO> {
  constructor(private createUserCommand: CreateUserCommand) {}

  async handle(request: CreateUserRequest): Promise<UserResponseDTO> {
    return await this.createUserCommand.execute(request.data);
  }
}

export class UpdateUserHandler implements IRequestHandler<UpdateUserRequest, UserResponseDTO> {
  constructor(private updateUserCommand: UpdateUserCommand) {}

  async handle(request: UpdateUserRequest): Promise<UserResponseDTO> {
    return await this.updateUserCommand.execute(request.id, request.data);
  }
}

export class DeleteUserHandler implements IRequestHandler<DeleteUserRequest, boolean> {
  constructor(private deleteUserCommand: DeleteUserCommand) {}

  async handle(request: DeleteUserRequest): Promise<boolean> {
    return await this.deleteUserCommand.execute(request.id);
  }
}