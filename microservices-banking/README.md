# Microservices Banking - TP3

Architecture microservices pour la gestion bancaire d'utilisateurs avec cohérence des données distribuées.

## Architecture

### Microservices
- **user-service** (Port 3001) - Gestion des utilisateurs
- **account-service** (Port 3002) - Gestion des comptes bancaires
- **RabbitMQ** (Ports 5672, 15672) - Bus d'événements pour communication asynchrone

### Patterns architecturaux
- **CQRS** (Command Query Responsibility Segregation) dans chaque service
- **Saga Pattern Choreography** pour la cohérence transactionnelle entre services
- **Service Composite** pour les requêtes agrégées
- **Event-Driven Architecture** avec RabbitMQ

### Bases de données
Chaque service dispose de **sa propre base de données MySQL** :
- `users_db` pour user-service
- `accounts_db` pour account-service

## Installation et lancement

### Avec Docker Compose (recommandé)

```bash
docker-compose up --build
```

Les services seront disponibles sur :
- User Service: http://localhost:3001
- Account Service: http://localhost:3002
- RabbitMQ Management UI: http://localhost:15672 (admin/admin)

### Sans Docker (développement local)

1. Démarrer RabbitMQ :
```bash
# Avec Homebrew (Mac)
brew services start rabbitmq

# Ou avec Docker
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

2. Créer les bases de données MySQL :
```sql
CREATE DATABASE users_db;
CREATE DATABASE accounts_db;
```

3. Configurer les variables d'environnement :
```bash
# user-service/.env
cp user-service/.env.example user-service/.env

# account-service/.env
cp account-service/.env.example account-service/.env
```

4. Installer les dépendances et démarrer chaque service :
```bash
# Terminal 1 - User Service
cd user-service
npm install
npm run dev

# Terminal 2 - Account Service
cd account-service
npm install
npm run dev
```

## API Endpoints

### User Service (Port 3001)

#### CRUD Utilisateurs
- `POST /api/users` - Créer un utilisateur (déclenche création automatique de compte)
- `GET /api/users` - Lister tous les utilisateurs
- `GET /api/users/:id` - Récupérer un utilisateur
- `PUT /api/users/:id` - Modifier un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur (déclenche suppression automatique des comptes)

#### Requête Agrégée
- `GET /api/users/:id/with-accounts` - **Récupérer utilisateur avec ses comptes bancaires**

#### Health Check
- `GET /health` - Health check

**Exemple CREATE user (crée automatiquement un compte):**
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nom":"Dupont",
    "prenom":"Jean",
    "email":"jean.dupont@company.com",
    "telephone":"0123456789"
  }'
```

**Exemple requête agrégée:**
```bash
curl http://localhost:3001/api/users/1/with-accounts
```

### Account Service (Port 3002)

- `POST /api/accounts` - Créer un compte bancaire
- `GET /api/accounts` - Lister tous les comptes
- `GET /api/accounts/:id` - Récupérer un compte
- `GET /api/accounts/user/:userId` - Récupérer les comptes d'un utilisateur
- `DELETE /api/accounts/:id` - Supprimer un compte
- `GET /health` - Health check

**Exemple CREATE account:**
```bash
curl -X POST http://localhost:3002/api/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "userId":1,
    "balance":100.50
  }'
```

## Fonctionnalités clés

### 1. Transaction Atomique (Saga Pattern)

Grâce au **Pattern Saga avec RabbitMQ**, les opérations suivantes sont atomiques :

**Création d'utilisateur → Création de compte automatique**
- Si la création du compte échoue, l'utilisateur est automatiquement supprimé (compensation)
- Événements : `UserCreated` → `AccountCreated` ou `AccountCreationFailed`

**Suppression d'utilisateur → Suppression de comptes automatique**
- Si la suppression des comptes échoue, l'utilisateur reste en base (rollback)
- Événements : `UserDeleted` → `AccountsDeleted` ou `AccountsDeletionFailed`

### 2. Requête Agrégée Transverse

L'endpoint `GET /api/users/:id/with-accounts` retourne :
- Les données de l'utilisateur (nom, prénom, email, profil)
- La liste de tous ses comptes bancaires

**Implémentation** : Service Composite dans user-service qui appelle account-service via HTTP

### 3. Architecture CQRS

Chaque service utilise le pattern CQRS :
- **Commands** : CreateUser, UpdateUser, DeleteUser, CreateAccount, DeleteAccount
- **Queries** : GetUserById, GetAllUsers, GetAccountById, GetUserWithAccounts
- **MediatR** : Routing centralisé des requêtes vers les handlers appropriés

## Règles métier

### User Service
- Profil automatiquement assigné selon domaine email :
  - `@company.com` → Administrateur
  - Autres domaines → Utilisateur standard
- Création d'utilisateur déclenche la création automatique d'un compte bancaire
- Suppression d'utilisateur déclenche la suppression de tous ses comptes

### Account Service
- Numéro de compte généré automatiquement (format: `ACC{timestamp}{random}`)
- Solde initial par défaut : 0.00
- Écoute les événements `UserCreated` et `UserDeleted` pour gérer les comptes

## Flux d'événements (Saga)

### Scénario 1 : Création d'utilisateur réussie
```
1. POST /api/users
2. user-service → crée l'utilisateur en DB
3. user-service → publie UserCreated via RabbitMQ
4. account-service → reçoit UserCreated
5. account-service → crée le compte bancaire
6. account-service → publie AccountCreated
7. user-service → reçoit AccountCreated ✅ Transaction complète
```

### Scénario 2 : Échec de création de compte (avec compensation)
```
1. POST /api/users
2. user-service → crée l'utilisateur en DB
3. user-service → publie UserCreated via RabbitMQ
4. account-service → reçoit UserCreated
5. account-service → ÉCHEC lors de la création du compte ❌
6. account-service → publie AccountCreationFailed
7. user-service → reçoit AccountCreationFailed
8. user-service → SUPPRIME l'utilisateur (compensation) 🔄 Rollback effectué
```

## Tests

### Test complet du Saga Pattern

```bash
# 1. Créer un utilisateur (doit créer un compte automatiquement)
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"nom":"Saga","prenom":"Test","email":"saga@company.com","telephone":"0123456789"}'

# 2. Vérifier que le compte a été créé automatiquement
curl http://localhost:3002/api/accounts

# 3. Requête agrégée pour voir l'utilisateur avec ses comptes
curl http://localhost:3001/api/users/1/with-accounts

# 4. Supprimer l'utilisateur (doit supprimer les comptes automatiquement)
curl -X DELETE http://localhost:3001/api/users/1

# 5. Vérifier que les comptes ont été supprimés
curl http://localhost:3002/api/accounts
```

### Vérifier les événements RabbitMQ

```bash
# Voir les logs du user-service
docker logs user-service

# Voir les logs du account-service
docker logs account-service

# Accéder au management UI
# http://localhost:15672 (admin/admin)
```

## Structure du projet

```
microservices-banking/
├── user-service/
│   ├── src/
│   │   ├── application/
│   │   │   ├── commands/          # CQRS Commands
│   │   │   ├── queries/           # CQRS Queries (incluant agrégation)
│   │   │   ├── handlers/          # Command & Query Handlers
│   │   │   ├── sagas/             # UserSaga (compensation logic)
│   │   │   ├── mediator/          # MediatR pattern
│   │   │   └── container/         # Dependency Injection
│   │   ├── infrastructure/
│   │   │   ├── messaging/         # EventBus RabbitMQ
│   │   │   └── http/              # AccountServiceClient
│   │   ├── models/                # User model
│   │   ├── controllers/           # CQRSUserController
│   │   └── routes/                # API routes
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── account-service/
│   ├── src/
│   │   ├── application/
│   │   │   ├── commands/          # CQRS Commands
│   │   │   ├── queries/           # CQRS Queries
│   │   │   ├── handlers/          # Command & Query Handlers
│   │   │   ├── sagas/             # AccountSaga (event listeners)
│   │   │   ├── mediator/          # MediatR pattern
│   │   │   └── container/         # Dependency Injection
│   │   ├── infrastructure/
│   │   │   └── messaging/         # EventBus RabbitMQ
│   │   ├── models/                # Account model
│   │   ├── controllers/           # CQRSAccountController
│   │   └── routes/                # API routes
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml              # MySQL + RabbitMQ + services
├── init-db.sql                     # Initialisation des DB
└── README.md
```

## Technologies

- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **Sequelize** - ORM pour MySQL
- **MySQL 8.0** - Bases de données
- **RabbitMQ** - Message broker
- **amqplib** - Client RabbitMQ
- **axios** - Client HTTP pour communication inter-services
- **Docker** + **Docker Compose**

## État d'avancement

- ✅ **Étape 1** : Développement des deux microservices indépendants
  - User Service avec CQRS complet
  - Account Service avec CQRS complet
  - Bases de données séparées
  - Docker setup complet avec RabbitMQ

- ✅ **Étape 2** : Garantir la cohérence des données
  - Pattern Saga Choreography implémenté
  - Event Bus avec RabbitMQ
  - Mécanismes de compensation (rollback) en cas d'échec
  - Transaction atomique : création/suppression utilisateur ↔ comptes

- ✅ **Étape 3** : Requêtes transverses
  - Service Composite pour requêtes agrégées
  - Endpoint `/api/users/:id/with-accounts`
  - Communication HTTP entre services

## Livrables

- ✅ Code source versionné sur Git
- ✅ Docker Compose pour déploiement complet
- ✅ Documentation technique (README)
- ✅ Tests fonctionnels validés
- ✅ Architecture CQRS + Saga + Service Composite

---

**Architecture finale** : Microservices avec CQRS, Saga Pattern, Event-Driven Architecture et Service Composite pour garantir la cohérence des données distribuées.
