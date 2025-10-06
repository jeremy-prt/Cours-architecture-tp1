import { EventBus } from '../../infrastructure/messaging/EventBus';
import {
  AccountCreationFailedEvent,
  AccountCreatedEvent,
  AccountsDeletionFailedEvent,
  AccountsDeletedEvent,
  SagaEvent,
} from '../../infrastructure/messaging/Events';
import User from '../../models/User';

// Gère la logique de compensation pour les transactions distribuées
export class UserSaga {
  constructor(private eventBus: EventBus) {}

  async initialize(): Promise<void> {
    // Écouter les événements de succès/échec du service de comptes
    await this.eventBus.subscribe('AccountCreated', this.handleAccountCreated.bind(this));
    await this.eventBus.subscribe(
      'AccountCreationFailed',
      this.handleAccountCreationFailed.bind(this)
    );
    await this.eventBus.subscribe('AccountsDeleted', this.handleAccountsDeleted.bind(this));
    await this.eventBus.subscribe(
      'AccountsDeletionFailed',
      this.handleAccountsDeletionFailed.bind(this)
    );

    console.log('[UserSaga] Saga initialisé et écoute les événements');
  }

  private async handleAccountCreated(event: SagaEvent): Promise<void> {
    const accountCreatedEvent = event as AccountCreatedEvent;
    console.log(
      `[UserSaga] ✅ Compte créé avec succès pour l'utilisateur ${accountCreatedEvent.userId}`
    );
    // Pas de compensation nécessaire - transaction réussie
  }

  private async handleAccountCreationFailed(event: SagaEvent): Promise<void> {
    const failedEvent = event as AccountCreationFailedEvent;
    console.log(
      `[UserSaga] ❌ Échec de création de compte pour l'utilisateur ${failedEvent.userId}: ${failedEvent.error}`
    );

    // COMPENSATION: Supprimer l'utilisateur créé
    try {
      await User.destroy({ where: { id: failedEvent.userId } });
      console.log(
        `[UserSaga] 🔄 ROLLBACK: Utilisateur ${failedEvent.userId} supprimé (compensation)`
      );
    } catch (error) {
      console.error(
        `[UserSaga] ⚠️ Erreur lors du rollback de l'utilisateur ${failedEvent.userId}:`,
        error
      );
    }
  }

  private async handleAccountsDeleted(event: SagaEvent): Promise<void> {
    const accountsDeletedEvent = event as AccountsDeletedEvent;
    console.log(
      `[UserSaga] ✅ Comptes supprimés avec succès pour l'utilisateur ${accountsDeletedEvent.userId}`
    );
    // Pas de compensation nécessaire - transaction réussie
  }

  private async handleAccountsDeletionFailed(event: SagaEvent): Promise<void> {
    const failedEvent = event as AccountsDeletionFailedEvent;
    console.log(
      `[UserSaga] ❌ Échec de suppression de comptes pour l'utilisateur ${failedEvent.userId}: ${failedEvent.error}`
    );

    // Pour la suppression, la compensation est plus complexe
    // On ne peut pas facilement "recréer" l'utilisateur
    // Options possibles:
    // 1. Logger l'erreur dans une table d'audit
    // 2. Envoyer une alerte
    // 3. Marquer l'utilisateur comme "en erreur" (si on l'avait gardé)
    console.log(
      `[UserSaga] ⚠️ ATTENTION: Transaction de suppression incomplète pour utilisateur ${failedEvent.userId}`
    );
    // Dans un système réel, on pourrait avoir une Dead Letter Queue ou un système d'alerte
  }
}
