const cron = require('node-cron')
const parser = require('cron-parser')
const db = require('../models') // Adjust the path as necessary
const JobExecutor = require('./JobExecutor')

// Initialize the scheduledTasks map outside the class
let scheduledTasks = {};

class SchedulerService {
    static async scheduleJob(job) {
        // Directly access the scheduledTasks map without using this.constructor
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
            timezone: "America/New_York" // Adjust as necessary
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
        if (this.constructor.scheduledTasks[jobId]) {
            this.constructor.scheduledTasks[jobId].stop();
            delete this.constructor.scheduledTasks[jobId];
            console.log(`Stopped and deleted scheduled task for job ID: ${jobId}`);
        }
    
        // Proceed with deleting the job from the database
        await db.Job.destroy({ where: { job_id: jobId } });
    }
}

module.exports = SchedulerService
