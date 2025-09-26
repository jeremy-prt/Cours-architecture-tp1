# TP1 - Architecture N-Layer

## Installation et lancement

```bash
npm install
npm run dev
```

## Configuration

Configurer `.env` avec vos paramètres de base de données (voir `.env.example`)

## Architecture N-Layer

- **Routes** (`src/routes/`) - Endpoints API avec DTOs
- **Services** (`src/services/`) - Logique métier (implémente interfaces)
- **Repositories** (`src/repositories/`) - Accès données (implémente interfaces)
- **Models** (`src/models/`) - Entités Sequelize
- **Interfaces** (`src/interfaces/`) - Contrats entre couches
- **DTOs** (`src/dtos/`) - Objets transfert données I/O
- **DI** (`src/di/`) - Injection de dépendances

## API Endpoints

- `POST /api/users` - Créer utilisateur
- `GET /api/users` - Lister utilisateurs
- `GET /api/users/:id` - Récupérer utilisateur
- `PUT /api/users/:id` - Modifier utilisateur
- `DELETE /api/users/:id` - Supprimer utilisateur
