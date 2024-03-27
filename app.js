const express = require('express');
const db = require('./models');
const scheduler = require('./services/scheduler');


const app = express();
const PORT = process.env.PORT || 3000;

db.sequelize.sync().then(() => {
  app.use(express.json());

  const jobRoutes = require('./routes/job');
  const jobExecutionRoutes = require('./routes/jobExecution');
  app.use('/jobs', jobRoutes);
  app.use('/job-executions', jobExecutionRoutes);

  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`)
    await scheduler.loadAndScheduleJobs();
  });
});
