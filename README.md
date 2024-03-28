# Scheduler Service

The Scheduler Service is a containerized REST API designed to manage and schedule jobs that perform HTTP requests. It's capable of handling various HTTP methods, storing job definitions, scheduling their execution, and logging each job's outcome. This service is particularly useful for orchestrating tasks across microservices in a larger application architecture.

## How It Works

The service provides endpoints for creating, reading, updating, and deleting scheduled jobs. Each job can be configured with a specific HTTP method, URL, headers, payload, and a CRON-like schedule. The service uses a Node.js environment with Express for routing and Sequelize as the ORM for database interactions using PostgreSQL.

When a job is scheduled, the service uses the `node-cron` library to execute the job at the specified interval. The job's outcome is logged in the database, including the HTTP response status code, response body, and any errors that occurred during execution.

## Usage

<!-- Go checkout the swagger available at /swagger -->
You can check the swagger documentation at [Swagger](http://localhost:3000/swagger) to see all the available endpoints and their respective parameters.

## Running the Service

To run the service locally, you must have Docker installed. Build and run the container using the following commands:
    
```bash
docker build -t scheduler-service .
docker run -p 3000:3000 scheduler-service
```

Ensure you've configured the necessary environment variables for database connections and any other required settings in a .env file or Docker environment configuration.

## Environment Variables

- DB_HOST - The hostname of your database server.
- DB_USER - The database user.
- DB_PASS - The password for the database user.
- DB_NAME - The name of the database to connect to.
- DB_PORT - The port on which your database is running.

## Authentication

The service uses simple API key authentication for secure communication with other microservices. Include your API key in the `Authorization` header of each request.