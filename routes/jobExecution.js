const express = require('express')
const router = express.Router()
const db = require('../models')
const JobExecution = db.JobExecution

// Retrieve all Job Executions
router.get('/', async (req, res) => {
	try {
		const jobExecutions = await JobExecution.findAll()
		res.status(200).send(jobExecutions)
	} catch (error) {
		res.status(400).send(error)
	}
})

// Retrieve a single Job Execution by Id
router.get('/:id', async (req, res) => {
	try {
		const jobExecution = await JobExecution.findByPk(req.params.id)
		if (jobExecution) {
			res.status(200).send(jobExecution)
		} else {
			res.status(404).send({ message: 'Job Execution not found!' })
		}
	} catch (error) {
		res.status(400).send(error)
	}
})

// retrieve all Job Executions for a specific Job
router.get('/job/:jobId', async (req, res) => {
	try {
		const jobExecutions = await JobExecution.findAll({
			where: { job_id: req.params.jobId }
		})
		res.status(200).send(jobExecutions)
	} catch (error) {
		res.status(400).send(error)
	}
})

module.exports = router