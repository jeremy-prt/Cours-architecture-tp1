import { IRequest } from '../mediator/IRequest';
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from '../dtos/UserDTOs';

// Commands (Write operations)
export class CreateUserRequest implements IRequest<UserResponseDTO> {
  constructor(public readonly data: CreateUserDTO) {}
}

export class UpdateUserRequest implements IRequest<UserResponseDTO> {
  constructor(
    public readonly id: number,
    public readonly data: UpdateUserDTO
  ) {}
}

export class DeleteUserRequest implements IRequest<boolean> {
  constructor(public readonly id: number) {}
}

// Queries (Read operations)
export class GetUserByIdRequest implements IRequest<UserResponseDTO | null> {
  constructor(public readonly id: number) {}
}

export class GetAllUsersRequest implements IRequest<UserResponseDTO[]> {
  // No parameters needed for get all
}