export interface IRequest<TResponse> {
  // Marker interface for requests
}

export interface IRequestHandler<TRequest extends IRequest<TResponse>, TResponse> {
  handle(request: TRequest): Promise<TResponse>;
}