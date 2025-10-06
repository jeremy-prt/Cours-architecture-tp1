import { IRequestHandler } from '../mediator/IRequest';
import { CreateUserRequest, UpdateUserRequest, DeleteUserRequest } from '../requests/UserRequests';
import { CreateUserCommand } from '../commands/CreateUserCommand';
import { UpdateUserCommand } from '../commands/UpdateUserCommand';
import { DeleteUserCommand } from '../commands/DeleteUserCommand';
import { UserResponseDTO } from '../dtos/UserDTOs';
import { EventBus } from '../../infrastructure/messaging/EventBus';
import { UserCreatedEvent, UserDeletedEvent } from '../../infrastructure/messaging/Events';
import { v4 as uuidv4 } from 'uuid';

export class CreateUserHandler implements IRequestHandler<CreateUserRequest, UserResponseDTO> {
  constructor(
    private createUserCommand: CreateUserCommand,
    private eventBus: EventBus
  ) {}

  async handle(request: CreateUserRequest): Promise<UserResponseDTO> {
    const user = await this.createUserCommand.execute(request.data);

    // Publier l'événement UserCreated pour déclencher la création du compte
    const event: UserCreatedEvent = {
      eventType: 'UserCreated',
      timestamp: new Date(),
      correlationId: uuidv4(),
      userId: user.id,
      userData: {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        profil: user.profil,
      },
    };

    await this.eventBus.publish(event);

    return user;
  }
}

export class UpdateUserHandler implements IRequestHandler<UpdateUserRequest, UserResponseDTO> {
  constructor(private updateUserCommand: UpdateUserCommand) {}

  async handle(request: UpdateUserRequest): Promise<UserResponseDTO> {
    return await this.updateUserCommand.execute(request.id, request.data);
  }
}

export class DeleteUserHandler implements IRequestHandler<DeleteUserRequest, boolean> {
  constructor(
    private deleteUserCommand: DeleteUserCommand,
    private eventBus: EventBus
  ) {}

  async handle(request: DeleteUserRequest): Promise<boolean> {
    const result = await this.deleteUserCommand.execute(request.id);

    // Publier l'événement UserDeleted pour déclencher la suppression des comptes
    const event: UserDeletedEvent = {
      eventType: 'UserDeleted',
      timestamp: new Date(),
      correlationId: uuidv4(),
      userId: request.id,
    };

    await this.eventBus.publish(event);

    return result;
  }
}
