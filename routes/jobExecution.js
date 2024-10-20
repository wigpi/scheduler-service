const express = require('express');
const router = express.Router();
const prisma = require('../models');
const adminKeyCheck = require('../middlewares/adminKeyCheck'); // Import the middleware

// Apply the adminKeyCheck middleware to all routes
router.use(adminKeyCheck);

// Retrieve all Job Executions
router.get('/', async (req, res) => {
    try {
        const jobExecutions = await prisma.jobExecution.findMany();
        res.status(200).send(jobExecutions);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Retrieve a single Job Execution by Id
router.get('/:id', async (req, res) => {
    try {
        const jobExecution = await prisma.jobExecution.findUnique({
            where: { execution_id: req.params.id },
        });
        if (jobExecution) {
            res.status(200).send(jobExecution);
        } else {
            res.status(404).send({ message: 'Job Execution not found!' });
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

// Retrieve all Job Executions for a specific Job
router.get('/job/:jobId', async (req, res) => {
    try {
        const jobExecutions = await prisma.jobExecution.findMany({
            where: { job_id: req.params.jobId },
        });
        res.status(200).send(jobExecutions);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
