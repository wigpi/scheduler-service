const express = require('express');
const db = require('./models');
const scheduler = require('./services/scheduler');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const app = express();
const PORT = process.env.PORT || 3000;

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