import { EventBus } from '../../infrastructure/messaging/EventBus';
import {
  UserCreatedEvent,
  UserDeletedEvent,
  SagaEvent,
  AccountCreatedEvent,
  AccountCreationFailedEvent,
  AccountsDeletedEvent,
  AccountsDeletionFailedEvent,
} from '../../infrastructure/messaging/Events';
import Account from '../../models/Account';
import { v4 as uuidv4 } from 'uuid';

// Génère un numéro de compte unique
const generateAccountNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ACC${timestamp}${random}`;
};

// Gère les événements liés aux utilisateurs pour créer/supprimer des comptes
export class AccountSaga {
  constructor(private eventBus: EventBus) {}

  async initialize(): Promise<void> {
    // Écouter les événements de création/suppression d'utilisateurs
    await this.eventBus.subscribe('UserCreated', this.handleUserCreated.bind(this));
    await this.eventBus.subscribe('UserDeleted', this.handleUserDeleted.bind(this));

    console.log('[AccountSaga] Saga initialisé et écoute les événements utilisateur');
  }

  private async handleUserCreated(event: SagaEvent): Promise<void> {
    const userCreatedEvent = event as UserCreatedEvent;
    console.log(
      `[AccountSaga] 📥 Réception de UserCreated pour utilisateur ${userCreatedEvent.userId}`
    );

    try {
      // Créer automatiquement un compte pour le nouvel utilisateur
      const accountNumber = generateAccountNumber();
      const account = await Account.create({
        userId: userCreatedEvent.userId,
        accountNumber,
        balance: 0.0,
      });

      console.log(
        `[AccountSaga] ✅ Compte créé avec succès: ${accountNumber} pour utilisateur ${userCreatedEvent.userId}`
      );

      // Publier l'événement de succès
      const successEvent: AccountCreatedEvent = {
        eventType: 'AccountCreated',
        timestamp: new Date(),
        correlationId: userCreatedEvent.correlationId,
        userId: userCreatedEvent.userId,
        accountId: account.id,
        accountNumber: account.accountNumber,
      };

      await this.eventBus.publish(successEvent);
    } catch (error: any) {
      console.error(
        `[AccountSaga] ❌ Échec de création de compte pour utilisateur ${userCreatedEvent.userId}:`,
        error
      );

      // Publier l'événement d'échec pour déclencher compensation
      const failureEvent: AccountCreationFailedEvent = {
        eventType: 'AccountCreationFailed',
        timestamp: new Date(),
        correlationId: userCreatedEvent.correlationId,
        userId: userCreatedEvent.userId,
        error: error.message || 'Erreur inconnue lors de la création du compte',
      };

      await this.eventBus.publish(failureEvent);
    }
  }

  private async handleUserDeleted(event: SagaEvent): Promise<void> {
    const userDeletedEvent = event as UserDeletedEvent;
    console.log(
      `[AccountSaga] 📥 Réception de UserDeleted pour utilisateur ${userDeletedEvent.userId}`
    );

    try {
      // Supprimer tous les comptes associés à cet utilisateur
      const deletedCount = await Account.destroy({
        where: { userId: userDeletedEvent.userId },
      });

      console.log(
        `[AccountSaga] ✅ ${deletedCount} compte(s) supprimé(s) pour utilisateur ${userDeletedEvent.userId}`
      );

      // Publier l'événement de succès
      const successEvent: AccountsDeletedEvent = {
        eventType: 'AccountsDeleted',
        timestamp: new Date(),
        correlationId: userDeletedEvent.correlationId,
        userId: userDeletedEvent.userId,
      };

      await this.eventBus.publish(successEvent);
    } catch (error: any) {
      console.error(
        `[AccountSaga] ❌ Échec de suppression de comptes pour utilisateur ${userDeletedEvent.userId}:`,
        error
      );

      // Publier l'événement d'échec
      const failureEvent: AccountsDeletionFailedEvent = {
        eventType: 'AccountsDeletionFailed',
        timestamp: new Date(),
        correlationId: userDeletedEvent.correlationId,
        userId: userDeletedEvent.userId,
        error: error.message || 'Erreur inconnue lors de la suppression des comptes',
      };

      await this.eventBus.publish(failureEvent);
    }
  }
}
