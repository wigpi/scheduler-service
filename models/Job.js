const { Model, DataTypes } = require('sequelize');

class Job extends Model {}

function initJob(sequelize) {
  Job.init({
    // Model attributes
    job_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    http_method: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    headers: {
        type: DataTypes.TEXT, // Assuming JSON string
    },
    payload: {
        type: DataTypes.TEXT, // Assuming JSON string
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    schedule: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    next_run_time: {
        type: DataTypes.DATE,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'Job',
    tableName: 'jobs',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Job;
}

module.exports = initJob;
