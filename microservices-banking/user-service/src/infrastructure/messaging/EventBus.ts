import * as amqp from 'amqplib';
import { SagaEvent } from './Events';

export class EventBus {
  private connection: any = null;
  private channel: any = null;
  private readonly exchangeName = 'saga_events';
  private readonly rabbitmqUrl: string;

  constructor(rabbitmqUrl: string) {
    this.rabbitmqUrl = rabbitmqUrl;
  }

  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.rabbitmqUrl);
      this.channel = await this.connection.createChannel();

      // Créer un exchange de type 'topic' pour le routage des événements
      await this.channel.assertExchange(this.exchangeName, 'topic', {
        durable: true,
      });

      console.log('[EventBus] Connecté à RabbitMQ');
    } catch (error) {
      console.error('[EventBus] Erreur de connexion à RabbitMQ:', error);
      throw error;
    }
  }

  async publish(event: SagaEvent): Promise<void> {
    if (!this.channel) {
      throw new Error('[EventBus] Canal RabbitMQ non initialisé');
    }

    const routingKey = event.eventType;
    const message = Buffer.from(JSON.stringify(event));

    this.channel.publish(this.exchangeName, routingKey, message, {
      persistent: true,
    });

    console.log(`[EventBus] Événement publié: ${event.eventType}`, {
      correlationId: event.correlationId,
    });
  }

  async subscribe(
    eventType: string,
    handler: (event: SagaEvent) => Promise<void>
  ): Promise<void> {
    if (!this.channel) {
      throw new Error('[EventBus] Canal RabbitMQ non initialisé');
    }

    // Créer une queue pour ce type d'événement
    const queueName = `${eventType}_queue`;
    await this.channel.assertQueue(queueName, { durable: true });

    // Lier la queue à l'exchange avec le routingKey = eventType
    await this.channel.bindQueue(queueName, this.exchangeName, eventType);

    console.log(`[EventBus] Souscription à l'événement: ${eventType}`);

    // Consommer les messages
    this.channel.consume(queueName, async (msg: any) => {
      if (msg) {
        try {
          const event = JSON.parse(msg.content.toString()) as SagaEvent;
          console.log(`[EventBus] Événement reçu: ${event.eventType}`, {
            correlationId: event.correlationId,
          });

          await handler(event);

          // Acquitter le message
          this.channel.ack(msg);
        } catch (error) {
          console.error('[EventBus] Erreur lors du traitement du message:', error);
          // Rejeter le message (il sera mis en DLQ si configuré)
          this.channel.nack(msg, false, false);
        }
      }
    });
  }

  async close(): Promise<void> {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
    console.log('[EventBus] Connexion RabbitMQ fermée');
  }
}
