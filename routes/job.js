const express = require('express');
const router = express.Router();
const prisma = require('../models');
const scheduler = require('../services/scheduler'); // Import scheduler service
const adminKeyCheck = require('../middlewares/adminKeyCheck'); // Import the middleware

// Apply the adminKeyCheck middleware to all routes
router.use(adminKeyCheck);

// Create a new Job
router.post('/', async (req, res) => {
    try {
        const job = await prisma.job.create({
            data: req.body,
        });
        await scheduler.loadAndScheduleJobs();
        res.status(201).send(job);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});

// Retrieve all Jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await prisma.job.findMany();
        res.status(200).send(jobs);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Retrieve a single Job by Id
router.get('/:id', async (req, res) => {
    try {
        const job = await prisma.job.findUnique({
            where: { job_id: req.params.id },
        });
        if (job) {
            res.status(200).send(job);
        } else {
            res.status(404).send({ message: 'Job not found!' });
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

// Update a Job
router.put('/:id', async (req, res) => {
    try {
        const job = await prisma.job.findUnique({
            where: { job_id: req.params.id },
        });
        if (job) {
            const updatedJob = await prisma.job.update({
                where: { job_id: req.params.id },
                data: req.body,
            });
            await scheduler.loadAndScheduleJobs();
            res.status(200).send(updatedJob);
        } else {
            res.status(404).send({ message: 'Job not found!' });
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a Job
router.delete('/:id', async (req, res) => {
    try {
        const job = await prisma.job.findUnique({
            where: { job_id: req.params.id },
        });
        if (job) {
            await scheduler.deleteJob(job.job_id);
            await prisma.job.delete({
                where: { job_id: job.job_id },
            });
            await scheduler.loadAndScheduleJobs();
            res.status(200).send({ message: 'Job deleted successfully!' });
        } else {
            res.status(404).send({ message: 'Job not found!' });
        }
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
});

module.exports = router;
