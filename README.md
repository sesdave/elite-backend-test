# Elite Backend Test

A backend test application for Elite Software Automation.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Authentication](#authentication)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Redis](#redis)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Description

Elite Backend Test is a backend application developed as part of a test for Elite Software Automation. The application provides endpoints for managing items, user authentication, and more. It is built using Node.js, Express.js, Sequelize ORM, Redis, and other libraries.

## Features

- User authentication using JWT
- CRUD operations for managing items
- Rate limiting and request throttling
- Automatic cleanup of expired database records

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js
- npm
- PostgreSQL database server
- Redis server

## Installation

1. Clone the repository:

```bash```
git clone https://github.com/your-username/elite-backend-test.git
cd elite-backend-test

2. Install dependencies:
npm install
2. Set up your environment variables by creating a .env file (see Environment Variables).

3. Set up your PostgreSQL database and Redis server (see Database and Redis).

4. Build the project:
npm run build

## Usage

To start the application, run:
npm start
The server will start on the specified port (default is 3000). You can access the API endpoints using a tool like Postman or by making requests from your frontend application.

## Endpoints

### Authentication

- **POST /auth/signup**: Sign up a new user.
- **POST /auth/login**: Log in an existing user.

### Items

- **GET /items**: Retrieve a list of items.
- **GET /items/:id**: Retrieve details of a specific item.
- **POST /items**: Create a new item.
- **PUT /items/:id**: Update an existing item.
- **DELETE /items/:id**: Delete an item.

## Authentication

Authentication is done using JSON Web Tokens (JWT). Users can sign up and log in to obtain a token, which is then used to access protected endpoints. The token should be included in the request headers as the `Authorization` header.

## Environment Variables

Create a `.env` file in the root directory of the project with the following environment variables:

dotenv
POSTGRES_NAME=your_db_name
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_HOST=your_db_host
POSTGRES_PORT=5432

REDIS_HOST=your_redis_host
REDIS_PASSWORD=your_redis_password


## Database and Redis

### Database

The application uses a PostgreSQL database to store user and item data. Sequelize ORM is used for database operations. To set up the database, follow these steps:

1. Run database migrations:

2. Seed the database with initial data:

### Redis

The application uses Redis for caching and session management. Before running the application, ensure you have a running Redis server. To configure Redis, update the settings in `src/utils/cache.ts`.

## Testing

Run tests to ensure the stability of the application:


## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1. Open an issue to discuss proposed changes or improvements.
2. Fork the repository and create a new branch.
3. Make your changes and test thoroughly.
4. Submit a pull request, referencing the issue for context.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
