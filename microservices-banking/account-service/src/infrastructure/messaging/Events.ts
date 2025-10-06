// Types d'événements pour le pattern Saga

export interface DomainEvent {
  eventType: string;
  timestamp: Date;
  correlationId: string;
}

export interface UserCreatedEvent extends DomainEvent {
  eventType: 'UserCreated';
  userId: number;
  userData: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    profil: string;
  };
}

export interface UserDeletedEvent extends DomainEvent {
  eventType: 'UserDeleted';
  userId: number;
}

export interface AccountCreatedEvent extends DomainEvent {
  eventType: 'AccountCreated';
  userId: number;
  accountId: number;
  accountNumber: string;
}

export interface AccountCreationFailedEvent extends DomainEvent {
  eventType: 'AccountCreationFailed';
  userId: number;
  error: string;
}

export interface AccountsDeletedEvent extends DomainEvent {
  eventType: 'AccountsDeleted';
  userId: number;
}

export interface AccountsDeletionFailedEvent extends DomainEvent {
  eventType: 'AccountsDeletionFailed';
  userId: number;
  error: string;
}

export type SagaEvent =
  | UserCreatedEvent
  | UserDeletedEvent
  | AccountCreatedEvent
  | AccountCreationFailedEvent
  | AccountsDeletedEvent
  | AccountsDeletionFailedEvent;
