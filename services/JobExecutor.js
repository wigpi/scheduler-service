const axios = require('axios');
const db = require('../models'); 
const JobExecution = db.JobExecution; // Adjust the model name as necessary


class JobExecutor {
  static async executeJob(job) {
    try {
      // Prepare the HTTP request based on the job details
      const config = {
        method: job.http_method,
        url: job.url,
        headers: job.headers ? JSON.parse(job.headers) : {},
        data: job.payload ? JSON.parse(job.payload) : {}
      };

      // Execute the HTTP request
      const response = await axios(config);

      // Log the successful execution
      await JobExecution.create({
        job_id: job.job_id,
        success: response.status >= 200 && response.status < 300,
        response_status: response.status,
        response_body: JSON.stringify(response.data),
        error_message: null,
      });

      console.log('Job executed successfully:', job.name);
    } catch (error) {
      console.error('Error executing job:', job.name, error.message);

      // Log the failed execution
      await JobExecution.create({
        job_id: job.job_id,
        success: false,
        response_status: error.response ? error.response.status : null,
        response_body: error.response ? JSON.stringify(error.response.data) : null,
        error_message: error.message,
      });
    }
  }
}

module.exports = JobExecutor;
