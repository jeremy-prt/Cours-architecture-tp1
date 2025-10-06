# Microservices Banking – Architecture Événementielle (TP3)

## Aperçu

Ce projet implémente un système bancaire basé sur une **architecture microservices** orientée événements, combinant :

- ✅ **CQRS (Command Query Responsibility Segregation)** dans chaque service
- ✅ **Saga Pattern (Choreography)** pour maintenir la cohérence distribuée
- ✅ **Event-Driven Architecture** via **RabbitMQ**
- ✅ **Service Composite** pour agréger les données entre services
- ✅ **Database Per Service** – chaque microservice possède sa propre base

---

## Architecture Globale

| Composant         | Port  | Rôle |
|------------------|------|----------------|
| `user-service`    | 3001 | Gestion des utilisateurs (CQRS) |
| `account-service` | 3002 | Gestion des comptes bancaires (CQRS) |
| `RabbitMQ`        | 5672 / 15672 | Message broker + interface de monitoring |

Interface RabbitMQ : **http://localhost:15672** (login : `admin` / `admin`)

---

## Installation & Lancement

```bash
cd microservices-banking
docker-compose up --build
```

Une fois lancé :

- ✅ `http://localhost:3001` → User Service  
- ✅ `http://localhost:3002` → Account Service

---

## Fonctionnalités Principales

### 1️⃣ **Transaction atomique avec Saga Pattern**

| Action | Effet automatique | Gestion d’échec |
|--------|------------------|------------------|
| Création utilisateur | Création d’un compte bancaire | Suppression utilisateur si échec |
| Suppression utilisateur | Suppression des comptes associés | Restauration utilisateur si échec |

---

### 2️⃣ **Requête Agrégée (Service Composite)**

```bash
GET /api/users/:id/with-accounts
```

**Réponse combinée User + Accounts :**

```json
{
  "user": { ... },
  "accounts": [ ... ]
}
```

---

### 3️⃣ **Événements RabbitMQ utilisés**

| Événement | Emis par | Reçu par |
|-----------|----------|----------|
| `UserCreated` | user-service | account-service |
| `UserDeleted` | user-service | account-service |
| `AccountCreationFailed` | account-service | user-service (compensation) |
| `AccountsDeleted` | account-service | user-service |
| `AccountsDeletionFailed` | account-service | user-service (compensation) |

---

## Tests Rapides

```bash
# 1. Créer un utilisateur → crée automatiquement un compte
curl -X POST http://localhost:3001/api/users   -H "Content-Type: application/json"   -d '{"nom":"Test","prenom":"Saga","email":"test@company.com","telephone":"0123456789"}'

# 2. Consulter l'utilisateur et ses comptes (requête agrégée)
curl http://localhost:3001/api/users/1/with-accounts

# 3. Supprimer l'utilisateur → supprime les comptes automatiquement
curl -X DELETE http://localhost:3001/api/users/1
```

---

## 🧠 Rappel CQRS (Concepts utilisés dans chaque service)

| Dossier | Rôle |
|---------|------|
| `commands/` | Écritures |
| `queries/` | Lectures |
| `handlers/` | Traitement |
| `events/` | Publication vers RabbitMQ |

---

## Évolution du Projet

| Version | Architecture |
|---------|-------------|
| v1 | N-Layer |
| v2 | Clean Architecture / DDD |
| v3 | CQRS + MediatR |
| ✅ v4 | **Microservices + Saga Pattern + Event-Driven** |
