const sequelize = require('../sequelize'); // Adjust this path as needed
const initJob = require('./Job');
// const initJobExecution = require('./JobExecution');

const db = {};

db.sequelize = sequelize;
db.Job = initJob(sequelize);
// db.JobExecution = initJobExecution(sequelize);

module.exports = db;
