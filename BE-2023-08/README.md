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
- [AwsSQS](#redis)
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
- Queuing for Selling with AWS SQS

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js
- npm
- PostgreSQL database server
- Redis server
- AWS SQS

## Installation

1. Clone the repository:

```bash
git clone https://github.com/sesdave/elite-backend-test.git
cd elite-backend-test
```

2. Install dependencies:
```bash
npm install
```
2. Set up your environment variables by creating a .env file (see Environment Variables).

3. Set up your PostgreSQL database and Redis server (see Database and Redis).

4. Create SQS topic and update url, accessKeyId and secretAccessKey in .env file [See Documentation for details](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html)

5. Build the project:
```bash
npm run build

```

## Usage

To start the application, run:
```bash
npm start
```
The server will start on the specified port (default is 3000). You can access the API endpoints using a tool like Postman or by making requests from your frontend application.

## Endpoints

### Authentication

- **POST /auth/signup**: Sign up a new user.
- **POST /auth/login**: Log in an existing user.

### Items

- **POST /:item/add**: Add item to Inventory.
- **POST /:item/sell**: Sell Item that has not Expired.
- **GET /:item/quantity**: Get Item Quantity.

## Authentication

Authentication is done using JSON Web Tokens (JWT). Users can sign up and log in to obtain a token, which is then used to access protected endpoints. The token should be included in the request headers as the `Authorization` header.

## Environment Variables

Create a `.env` file in the root directory of the project with the following environment variables:

```dotenv
POSTGRES_NAME=your_db_name
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_HOST=your_db_host
POSTGRES_PORT=5432

REDIS_HOST=your_redis_host
REDIS_PASSWORD=your_redis_password 
```


## Database and Redis

### Database

The application uses a PostgreSQL database to store user and item data. Sequelize ORM is used for database operations. To set up the database, follow these steps:

1. Run database migrations:
```bash
npm run db:migrate
```

2. Seed the database with initial data:
```bash
npm run db:seed
```

### Redis

The application uses Redis for caching and session management. Before running the application, ensure you have a running Redis server. To configure Redis, update the settings in `src/utils/cache.ts`.

## Queuing for Selling with AWS SQS

To enhance the scalability and reliability of the selling process, we use Amazon Simple Queue Service (SQS) for queuing and processing sell requests. This ensures efficient handling of sell requests even during high loads. Here's how you can integrate AWS SQS into the selling process:

### Configuration

1. Obtain your SQS Queue URL from the AWS Management Console.
2. Set the SQS_QUEUE_URL environment variable in your application with the Queue URL.
3. Navigate to sellWorker.ts in the worker directory
4. Run the worker - sellWorker.ts to start Receiving messages
```bash
ts-node sellConsumer.ts
```


## Testing

Run tests using:
```bash
npm test
```

## Documentation

Api Documentation can be accessed using postman on 

https://documenter.getpostman.com/view/22412718/2s9YBxYb5z


## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
