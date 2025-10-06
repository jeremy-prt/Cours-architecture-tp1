# TP1 - Architecture CQRS

## Installation et lancement

### Architecture CQRS (actuel)

```bash
npm install
npm run dev:cqrs
```

### Architecture Clean (v2)

```bash
npm run dev:clean
```

### Architecture N-Layer (v1)

```bash
npm run dev
```

## Configuration

Configurer `.env` avec vos paramètres de base de données (voir `.env.example`)

## Architecture CQRS

### Pattern CQRS (Command Query Responsibility Segregation)

**CQRS** sépare strictement les opérations de **lecture** (Queries) et d'**écriture** (Commands) dans la couche Application, avec un système de **MediatR** pour router les requêtes.

### Structure CQRS :

1. **Domain** (`src/domain/`) - Cœur métier isolé

   - `entities/` - Entités métier avec logique encapsulée
   - `valueobjects/` - Objets valeur immutables (Email, UserId, UserProfile)
   - `services/` - Services domaine (règles métier)

2. **Application** (`src/application/`) - **Séparation CQRS**

   - **`commands/`** - Commands pour les écritures (Create, Update, Delete)
   - **`queries/`** - Queries pour les lectures (GetById, GetAll)
   - **`handlers/`** - Handlers pour traiter Commands/Queries
   - **`requests/`** - Request objects CQRS
   - **`mediator/`** - Pattern MediatR pour routing
   - `dtos/` - Objets transfert données
   - `mappers/` - Mapping Domain ↔ DTOs
   - `ports/` - Interfaces (IUserRepository)

3. **Infrastructure** (`src/infrastructure/`) - Détails techniques

   - `persistence/` - Implémentation repository (Sequelize)
   - `di/` - Conteneur injection dépendances CQRS

4. **Presentation** (`src/presentation/`) - Interface utilisateur

   - `controllers/` - Contrôleurs utilisant MediatR
   - `routes/` - Routes Express

5. **Models** (`src/models/`) - Modèles ORM Sequelize

### Principes CQRS respectés :

- **Séparation Commands/Queries** : Écritures et lectures distinctes
- **MediatR Pattern** : Routage centralisé des requêtes
- **Single Responsibility** : Chaque handler a une seule responsabilité
- **Domain Isolation** : Domaine sans dépendances externes
- **Request/Response Pattern** : Communication via objets typés

### Bénéfices CQRS observés :

- **Clarté architecturale** : Séparation nette lecture/écriture
- **Scalabilité** : Possibilité d'optimiser séparément Commands et Queries
- **Maintenabilité** : Handlers découplés et testables unitairement
- **Extensibilité** : Ajout facile de nouveaux Commands/Queries
- **Performance** : Optimisations spécialisées par type d'opération

## API Endpoints

- `POST /api/users` - Créer utilisateur (profil auto-assigné selon email)
- `GET /api/users` - Lister utilisateurs
- `GET /api/users/:id` - Récupérer utilisateur
- `PUT /api/users/:id` - Modifier utilisateur
- `DELETE /api/users/:id` - Supprimer utilisateur

## Règle métier

Profil utilisateur assigné automatiquement :

- Email `@company.com` → Administrateur
- Autres domaines → Utilisateur standard

---

## TP3 - Architecture Microservices

### Localisation
Le projet microservices se trouve dans `microservices-banking/`

### Architecture complète

**Microservices:**
- **user-service** (Port 3001) - Gestion des utilisateurs avec CQRS
- **account-service** (Port 3002) - Gestion des comptes bancaires avec CQRS
- **RabbitMQ** (Ports 5672, 15672) - Message broker pour événements

**Patterns implémentés:**
- ✅ **CQRS** dans chaque microservice
- ✅ **Saga Pattern Choreography** - Cohérence transactionnelle distribuée
- ✅ **Event-Driven Architecture** - Communication asynchrone via RabbitMQ
- ✅ **Service Composite** - Requêtes agrégées entre services
- ✅ **Database per Service** - Bases de données indépendantes

### Installation et lancement

```bash
cd microservices-banking
docker-compose up --build
```

Services disponibles:
- User Service: http://localhost:3001
- Account Service: http://localhost:3002
- RabbitMQ UI: http://localhost:15672 (admin/admin)

### Fonctionnalités principales

**1. Transaction atomique (Saga Pattern)**
- Création utilisateur → Création compte automatique
- Suppression utilisateur → Suppression comptes automatique
- Rollback automatique en cas d'échec (compensation)

**2. Requête agrégée**
```bash
GET /api/users/:id/with-accounts
```
Retourne l'utilisateur avec tous ses comptes bancaires (données de 2 services)

**3. Événements RabbitMQ**
- `UserCreated` → Déclenche création de compte
- `UserDeleted` → Déclenche suppression de comptes
- `AccountCreated`, `AccountCreationFailed` (compensation)
- `AccountsDeleted`, `AccountsDeletionFailed` (compensation)

### Tests rapides

```bash
# Créer utilisateur (crée un compte automatiquement)
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"nom":"Test","prenom":"Saga","email":"test@company.com","telephone":"0123456789"}'

# Voir utilisateur avec ses comptes (requête agrégée)
curl http://localhost:3001/api/users/1/with-accounts

# Supprimer utilisateur (supprime les comptes automatiquement)
curl -X DELETE http://localhost:3001/api/users/1
```

Pour plus de détails, voir `microservices-banking/README.md`

---

## Évolution du projet

- **v1** : Architecture N-Layer basique
- **v2** : Clean Architecture avec Domain-Driven Design
- **v3** : CQRS avec MediatR Pattern
- **v4** : Microservices avec Saga Pattern + Event-Driven Architecture
