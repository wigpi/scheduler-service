-- DropForeignKey
ALTER TABLE "jobs_executions" DROP CONSTRAINT "jobs_executions_job_id_fkey";

-- AddForeignKey
ALTER TABLE "jobs_executions" ADD CONSTRAINT "jobs_executions_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("job_id") ON DELETE CASCADE ON UPDATE CASCADE;
