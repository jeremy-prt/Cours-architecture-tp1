# TP1 - Architecture Clean Architecture

## Installation et lancement

### Architecture Clean (recommandé)

```bash
npm install
npm run dev:clean
```

### Architecture N-Layer (legacy)

```bash
npm run dev
```

## Configuration

Configurer `.env` avec vos paramètres de base de données (voir `.env.example`)

## Architecture Clean Architecture

### Structure hexagonale en 5 couches :

1. **Domain** (`src/domain/`) - Cœur métier isolé

   - `entities/` - Entités métier avec logique encapsulée
   - `valueobjects/` - Objets valeur immutables (Email, UserId, UserProfile)
   - `services/` - Services domaine (règles métier)

2. **Application** (`src/application/`) - Orchestration cas d'usage

   - `usecases/` - Cas d'usage métier (CreateUser, GetUser...)
   - `ports/` - Interfaces (IUserRepository)
   - `dtos/` - Objets transfert données
   - `mappers/` - Mapping Domain ↔ DTOs

3. **Infrastructure** (`src/infrastructure/`) - Détails techniques

   - `persistence/` - Implémentation repository (Sequelize)
   - `di/` - Conteneur injection dépendances

4. **Presentation** (`src/presentation/`) - Interface utilisateur

   - `controllers/` - Contrôleurs REST
   - `routes/` - Routes Express
   - `middlewares/` - Middlewares HTTP

5. **Models** (`src/models/`) - Modèles ORM Sequelize

### Principes respectés :

- **Dependency Inversion** : Dependencies pointent vers le domaine
- **Domain Isolation** : Domaine sans dépendances externes
- **Use Cases** : Orchestration logique applicative
- **Repository Pattern** : Abstraction persistance
- **Value Objects** : Objets métier immutables
- **Domain Services** : Règles métier complexes

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
