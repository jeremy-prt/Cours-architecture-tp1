// Simple Dependency Injection Container

import { IUserService } from '../interfaces/IUserService';
import { IUserRepository } from '../interfaces/IUserRepository';
import UserService from '../services/userService';
import UserRepository from '../repositories/userRepository';

class DIContainer {
  private services = new Map<string, any>();

  constructor() {
    this.registerServices();
  }

  private registerServices(): void {
    // Register Repository
    const userRepository: IUserRepository = new UserRepository();
    this.services.set('IUserRepository', userRepository);

    // Register Service with dependency injection
    const userService: IUserService = new UserService(userRepository);
    this.services.set('IUserService', userService);
  }

  get<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return service;
  }
}

export const container = new DIContainer();