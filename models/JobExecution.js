const { Model, DataTypes } = require('sequelize');
const Job = require('./Job');

class JobExecution extends Model {}

function initJobExecution(sequelize) {
    JobExecution.init({
        execution_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        job_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Job',
                key: 'job_id',
            },
        },
        executed_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        success: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        response_status: {
            type: DataTypes.INTEGER,
        },
        response_body: {
            type: DataTypes.TEXT, // Assuming JSON string
        },
        error_message: {
            type: DataTypes.TEXT,
        },
    }, {
        sequelize,
        modelName: 'JobExecution',
        tableName: 'jobs_executions',
        createdAt: 'executed_at',
        updatedAt: false,
    });
    return JobExecution;
}

module.exports = initJobExecution;