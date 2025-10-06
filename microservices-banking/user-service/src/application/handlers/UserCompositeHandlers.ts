import { IRequestHandler } from '../mediator/IRequest';
import { GetUserWithAccountsRequest } from '../requests/UserRequests';
import { GetUserWithAccountsQuery, UserWithAccountsDTO } from '../queries/GetUserWithAccountsQuery';

// Handler pour la requête composite/agrégée
export class GetUserWithAccountsHandler
  implements IRequestHandler<GetUserWithAccountsRequest, UserWithAccountsDTO | null>
{
  constructor(private getUserWithAccountsQuery: GetUserWithAccountsQuery) {}

  async handle(request: GetUserWithAccountsRequest): Promise<UserWithAccountsDTO | null> {
    return await this.getUserWithAccountsQuery.execute(request.id);
  }
}
