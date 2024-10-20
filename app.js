const express = require('express');
const db = require('./models');
const scheduler = require('./services/scheduler');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const app = express();
const PORT = process.env.PORT || 3000;

const syncDatabase = async () => {
    try {
        // Sync models in the correct order
        await db.Job.sync();            // Sync the Job model first
        await db.JobExecution.sync();    // Then sync JobExecution (which depends on Job)
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Error during database synchronization:', error);
        throw error;  // Make sure to stop if there's a sync error
    }
};

syncDatabase().then(() => {
    app.use(express.json());

    const jobRoutes = require('./routes/job');
    const jobExecutionRoutes = require('./routes/jobExecution');
    app.use('/jobs', jobRoutes);
    app.use('/jobs-executions', jobExecutionRoutes);
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.listen(PORT, async () => {
        console.log(`Server running on port ${PORT}`);
        await scheduler.loadAndScheduleJobs();
        scheduler.setupCleanupTask(); // Initialize the cleanup task
    });
});
