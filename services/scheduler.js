const cron = require('node-cron')
const parser = require('cron-parser')
const db = require('../models') // Adjust the path as necessary
const JobExecutor = require('./JobExecutor')
const { Op } = require('sequelize');

// Initialize the scheduledTasks map outside the class
let scheduledTasks = {};

class SchedulerService {
    static async scheduleJob(job) {
        if (scheduledTasks[job.job_id]) {
            scheduledTasks[job.job_id].stop();
            delete scheduledTasks[job.job_id];
        }
  
        // Schedule the job only if it's active
        if (job.active) {
            const task = cron.schedule(job.schedule, () => {
                console.log(`Executing job: ${job.name}`);
                JobExecutor.executeJob(job);
                const options = {
                    tz: "Europe/Paris"
                };
                job.next_run_time = parser.parseExpression(job.schedule,options).next().toString()
                job.save();
            }, {
                scheduled: true,
                timezone: "Europe/Paris"
            });
    
            // Store the scheduled task reference
            scheduledTasks[job.job_id] = task;
            console.log(`Scheduled job: ${job.name} with cron pattern: ${job.schedule}`);
        }
    }
  
    static async loadAndScheduleJobs() {
        const jobs = await db.Job.findAll();
        jobs.forEach(job => {
            this.scheduleJob(job);
        });
    }
  
    // Example method for unscheduling/deleting a job
    static async deleteJob(jobId) {
        // console.log(scheduledTasks)
        if (scheduledTasks[jobId]) {
            scheduledTasks[jobId].stop(); // Stop the scheduled task
            delete scheduledTasks[jobId]; // Remove it from the tracking object
            console.log(`Unscheduled and deleted job ID: ${jobId}`);
        }
        await db.Job.destroy({ where: { job_id: jobId } });
    }

    static async setupCleanupTask() {
        cron.schedule('* * * * *', async () => { // Every minute
            const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7));
            // const oneMinuteAgo = new Date(new Date().setMinutes(new Date().getMinutes() - 1));
            try {
                const result = await db.JobExecution.destroy({
                    where: {
                        executed_at: {
                            [Op.lt]: sevenDaysAgo
                        }
                    }
                });
                console.log(`Cleanup task: Deleted ${result} old job execution(s).`);
            } catch (error) {
                console.error('Error during cleanup task:', error);
            }
        }, {
            scheduled: true,
            timezone: "Europe/Paris"
        });
    }
}

module.exports = SchedulerService