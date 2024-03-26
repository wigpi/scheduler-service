# Scheduler Service

The Scheduler Service is a containerized REST API designed to manage and schedule jobs that perform HTTP requests. It's capable of handling various HTTP methods, storing job definitions, scheduling their execution, and logging each job's outcome. This service is particularly useful for orchestrating tasks across microservices in a larger application architecture.

## How It Works

The service provides endpoints for creating, reading, updating, and deleting scheduled jobs. Each job can be configured with a specific HTTP method, URL, headers, payload, and a CRON-like schedule. The service uses a Node.js environment with Express for routing and Sequelize as the ORM for database interactions, supporting both SQL and NoSQL databases.

## Usage

### Creating a Job

To create a new job, send a POST request to `/jobs` with a JSON body specifying the job details, including the `name`, `description`, `http_method`, `url`, `headers`, `payload`, `active`, and `schedule` fields.

Example request body:

```json
{
  "name": "Example Job",
  "description": "Fetches data from example.com",
  "http_method": "GET",
  "url": "https://www.example.com",
  "headers": "{}",
  "payload": "",
  "active": true,
  "schedule": "* * * * *"
}
```

### Viewing Jobs

To retrieve all scheduled jobs, send a GET request to /jobs.

### Updating a Job

To update an existing job, send a PUT request to /jobs/:id with the updated job details in the JSON body.

### Deleting a Job

To delete a job, send a DELETE request to /jobs/:id.

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