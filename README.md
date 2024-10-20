# Scheduler Service

The Scheduler Service is a containerized REST API designed to manage and schedule jobs that perform HTTP requests. It's capable of handling various HTTP methods, storing job definitions, scheduling their execution, and logging each job's outcome. This service is particularly useful for orchestrating tasks across microservices in a larger application architecture.

## How It Works

The service provides endpoints for creating, reading, updating, and deleting scheduled jobs. Each job can be configured with a specific HTTP method, URL, headers, payload, and a CRON-like schedule. The service uses a Node.js environment with Express for routing and Sequelize as the ORM for database interactions using PostgreSQL.

When a job is scheduled, the service uses the `node-cron` library to execute the job at the specified interval. The job's outcome is logged in the database, including the HTTP response status code, response body, and any errors that occurred during execution.

## Usage

<!-- Go checkout the swagger available at /swagger -->
You can check the swagger documentation at [Swagger](http://localhost:3000/api/documentation) to see all the available endpoints and their respective parameters.

## Running the Service

To run the service locally, you must have Docker installed. Build and run the container using the following commands:
    
```bash
docker build -t scheduler-service .
docker run -p 3000:3000 scheduler-service
```

Ensure you've configured the necessary environment variables for database connections and any other required settings in a .env file or Docker environment configuration.

## Environment Variables

- DATABASE_URL: The connection string for the PostgreSQL database.
- PORT: The port on which the service will listen for incoming requests.
- ADMIN_KEY: The API key used for authenticating requests to the service.
- ENV: The environment in which the service is running (dev, prod).

## Authentication

The service uses simple Admin key authentication for secure communication with other microservices. Include your Admin Key in the `admin_key` query param of each request.