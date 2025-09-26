import { IRequestHandler } from '../mediator/IRequest';
import { GetUserByIdRequest, GetAllUsersRequest } from '../requests/UserRequests';
import { GetUserByIdQuery } from '../queries/GetUserByIdQuery';
import { GetAllUsersQuery } from '../queries/GetAllUsersQuery';
import { UserResponseDTO } from '../dtos/UserDTOs';

export class GetUserByIdHandler implements IRequestHandler<GetUserByIdRequest, UserResponseDTO | null> {
  constructor(private getUserByIdQuery: GetUserByIdQuery) {}

  async handle(request: GetUserByIdRequest): Promise<UserResponseDTO | null> {
    return await this.getUserByIdQuery.execute(request.id);
  }
}

export class GetAllUsersHandler implements IRequestHandler<GetAllUsersRequest, UserResponseDTO[]> {
  constructor(private getAllUsersQuery: GetAllUsersQuery) {}

  async handle(request: GetAllUsersRequest): Promise<UserResponseDTO[]> {
    return await this.getAllUsersQuery.execute();
  }
}