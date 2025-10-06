# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js web application built for an architecture class (projet MBA - TP1). The application uses Express.js as the web framework and Sequelize ORM for MySQL database operations.

## Commands

### Development
- **Install dependencies**: `npm install`
- **Start development server**: No specific dev script configured. Use `node` to run main entry point once created.
- **Test**: `npm test` (currently shows error - no test specified)

### Database
- The application connects to MySQL database using Sequelize ORM
- Database configuration is managed through environment variables
- Connection is configured in `config/database.js` with support for MAMP (port 8889)

## Project Structure

- `config/database.js` - Database connection configuration using Sequelize
- `package.json` - Project dependencies and metadata
- `.env` - Environment variables (contains actual database credentials)
- `.env.example` - Template for environment variables

## Architecture

### Database Configuration
- Uses Sequelize ORM for database operations
- MySQL dialect configured for local development
- Environment-based configuration for database connection parameters
- Configured for MAMP development environment (default port 8889)

### Dependencies
- **Express.js** (^5.1.0) - Web framework
- **Sequelize** (^6.37.7) - ORM for database operations  
- **MySQL2** (^3.15.1) - MySQL driver for Node.js
- **Nodemon** (^3.1.10) - Development dependency for auto-restarting
- **dotenv** - Environment variable management (used in database.js)

## Environment Configuration

Required environment variables (see `.env.example`):
- `DB_NAME` - Database name
- `DB_USER` - Database username  
- `DB_PASSWORD` - Database password
- `DB_HOST` - Database host
- `DB_PORT` - Database port (8889 for MAMP)
- `DB_DIALECT` - Database dialect (mysql)

## Development Notes

- This appears to be the initial setup phase of the project
- No main application file (index.js, app.js, server.js) exists yet
- No test framework is configured
- The project uses CommonJS modules (`"type": "commonjs"`)
- Main entry point is configured as `index.js` in package.json but file doesn't exist yet