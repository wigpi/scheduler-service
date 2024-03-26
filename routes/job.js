const express = require('express')
const router = express.Router()
const db = require('../models')
const Job = db.Job

// Create a new Job
router.post('/', async (req, res) => {
    try {
        const job = await Job.create(req.body)
        res.status(201).send(job)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})

// Retrieve all Jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.findAll()
        res.status(200).send(jobs)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Retrieve a single Job by Id
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id)
        if (job) {
            res.status(200).send(job)
        } else {
            res.status(404).send({ message: 'Job not found!' })
        }
    } catch (error) {
        res.status(400).send(error)
    }
})

// Update a Job
router.put('/:id', async (req, res) => {
  try {
      const job = await Job.findByPk(req.params.id)
        if (job) {
            await job.update(req.body)
            res.status(200).send(job)
        } else {
            res.status(404).send({ message: 'Job not found!' })
        }
    } catch (error) {
        res.status(400).send(error)
    }
})

// Delete a Job
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id)
    if (job) {
        await job.destroy()
        res.status(200).send({ message: 'Job deleted successfully!' })
    } else {
        res.status(404).send({ message: 'Job not found!' })
    }
  } catch (error) {
        res.status(400).send(error)
  }
})

module.exports = router
