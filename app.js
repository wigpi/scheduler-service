const express = require('express');
const db = require('./models');
const scheduler = require('./services/scheduler');

const swaggerUi = require('swagger-ui-express');
const env = process.env.ENV || 'dev';
const swaggerDocument = require('./swagger.json');
const app = express();
const PORT = process.env.PORT || 3000;
const PROD_URL = process.env.PROD_URL;
app.use(express.json());

const jobRoutes = require('./routes/job');
const jobExecutionRoutes = require('./routes/jobExecution');

// Set the correct host based on the environment
if (env === 'dev') {
    swaggerDocument.host = `localhost:${port}`;
    swaggerDocument.schemes = ['http'];
} else if (env === 'prod') {
    swaggerDocument.host = PROD_URL.split(':')[1];
    swaggerDocument.schemes = [PROD_URL.split(':')[0]];
}

app.use('/api/jobs', jobRoutes);
app.use('/api/jobs-executions', jobExecutionRoutes);
app.use('/api/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await scheduler.loadAndScheduleJobs();
    scheduler.setupCleanupTask(); // Initialize the cleanup task
});