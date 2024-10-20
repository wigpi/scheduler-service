-- CreateTable
CREATE TABLE "jobs" (
    "job_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "http_method" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "headers" TEXT,
    "payload" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "schedule" TEXT NOT NULL,
    "next_run_time" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("job_id")
);

-- CreateTable
CREATE TABLE "jobs_executions" (
    "execution_id" UUID NOT NULL,
    "job_id" UUID NOT NULL,
    "executed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "success" BOOLEAN NOT NULL,
    "response_status" INTEGER,
    "response_body" TEXT,
    "error_message" TEXT,

    CONSTRAINT "jobs_executions_pkey" PRIMARY KEY ("execution_id")
);

-- AddForeignKey
ALTER TABLE "jobs_executions" ADD CONSTRAINT "jobs_executions_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("job_id") ON DELETE RESTRICT ON UPDATE CASCADE;
