const express = require('express');
const router = express.Router();
const db = require('../models');
const JobExecution = db.JobExecution;

// Create a new Job Execution
router.post('/', async (req, res) => {
  try {
    const jobExecution = await JobExecution.create(req.body);
    res.status(201).send(jobExecution);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Retrieve all Job Executions
router.get('/', async (req, res) => {
  try {
    const jobExecutions = await JobExecution.findAll();
    res.status(200).send(jobExecutions);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Retrieve a single Job Execution by Id
router.get('/:id', async (req, res) => {
  try {
    const jobExecution = await JobExecution.findByPk(req.params.id);
    if (jobExecution) {
      res.status(200).send(jobExecution);
    } else {
      res.status(404).send({ message: 'Job Execution not found!' });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update a Job Execution by Id
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await JobExecution.update(req.body, {
      where: { execution_id: req.params.id }
    });
    if (updated) {
      const updatedJobExecution = await JobExecution.findByPk(req.params.id);
      res.status(200).send(updatedJobExecution);
    } else {
      res.status(404).send({ message: 'Job Execution not found!' });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a Job Execution by Id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await JobExecution.destroy({
      where: { execution_id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).send({ message: 'Job Execution not found!' });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
