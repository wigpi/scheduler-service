require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

const createTables = async () => {
    const client = await pool.connect();
    try {
        // Enable UUID extension
        await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

        // Create jobs table
        await client.query(`
            CREATE TABLE IF NOT EXISTS jobs (
                job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(255) NOT NULL,
                description TEXT,
                http_method VARCHAR(10) NOT NULL,
                url VARCHAR(255) NOT NULL,
                headers TEXT, -- JSON string
                payload TEXT, -- JSON string
                active BOOLEAN NOT NULL DEFAULT true,
                schedule VARCHAR(100) NOT NULL,
                next_run_time TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create jobs_executions table
        await client.query(`
            CREATE TABLE IF NOT EXISTS jobs_executions (
                execution_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                job_id UUID NOT NULL,
                executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                success BOOLEAN NOT NULL,
                response_status INTEGER,
                response_body TEXT, -- JSON string
                error_message TEXT,
                FOREIGN KEY (job_id) REFERENCES jobs(job_id) ON DELETE CASCADE
            )
        `);

        console.log("Tables created successfully.");
    } catch (err) {
        console.error("Error creating tables:", err);
    } finally {
        client.release();
    }
};

createTables().catch(err => console.error("Error in setup script:", err));
