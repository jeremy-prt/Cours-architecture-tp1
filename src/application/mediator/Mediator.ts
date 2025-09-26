import { IRequest, IRequestHandler } from './IRequest';

export class Mediator {
  private handlers = new Map<string, IRequestHandler<any, any>>();

  register<TRequest extends IRequest<TResponse>, TResponse>(
    requestType: string,
    handler: IRequestHandler<TRequest, TResponse>
  ): void {
    this.handlers.set(requestType, handler);
  }

  async send<TResponse>(request: IRequest<TResponse>): Promise<TResponse> {
    const requestType = request.constructor.name;
    const handler = this.handlers.get(requestType);
    
    if (!handler) {
      throw new Error(`No handler registered for ${requestType}`);
    }

    return await handler.handle(request);
  }
}