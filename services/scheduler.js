const cron = require('node-cron');
const parser = require('cron-parser');
const prisma = require('../models');
const JobExecutor = require('./JobExecutor');

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
      const task = cron.schedule(
        job.schedule,
        async () => {
          console.log(`Executing job: ${job.name}`);
          await JobExecutor.executeJob(job);

          const options = {
            tz: 'Europe/Paris',
          };
          
          // Update next_run_time in the database
          const nextRunTime = parser.parseExpression(job.schedule, options).next().toString();
          await prisma.job.update({
            where: { job_id: job.job_id },
            data: { next_run_time: new Date(nextRunTime) },
          });
        },
        {
          scheduled: true,
          timezone: 'Europe/Paris',
        }
      );

      // Store the scheduled task reference
      scheduledTasks[job.job_id] = task;
      console.log(`Scheduled job: ${job.name} with cron pattern: ${job.schedule}`);
    }
  }

  static async loadAndScheduleJobs() {
    const jobs = await prisma.job.findMany();
    jobs.forEach(job => {
      this.scheduleJob(job);
    });
  }

  // Example method for unscheduling/deleting a job
  static async deleteJob(jobId) {
    if (scheduledTasks[jobId]) {
      scheduledTasks[jobId].stop(); // Stop the scheduled task
      delete scheduledTasks[jobId]; // Remove it from the tracking object
      console.log(`Unscheduled and deleted job ID: ${jobId}`);
    }

    await prisma.job.delete({
      where: { job_id: jobId },
    });
  }

  static async setupCleanupTask() {
    cron.schedule(
      '* * * * *', // Every minute
      async () => {
        const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7));

        try {
          const result = await prisma.jobExecution.deleteMany({
            where: {
              executed_at: {
                lt: sevenDaysAgo,
              },
            },
          });
          console.log(`Cleanup task: Deleted ${result.count} old job execution(s).`);
        } catch (error) {
          console.error('Error during cleanup task:', error);
        }
      },
      {
        scheduled: true,
        timezone: 'Europe/Paris',
      }
    );
  }
}

module.exports = SchedulerService;
