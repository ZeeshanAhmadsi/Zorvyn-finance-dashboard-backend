const express = require('express');
const router = express.Router();
const { createRecord, getRecords, updateRecord, deleteRecord } = require('../controllers/recordController');
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const { validate, validateQuery } = require('../middleware/validate');
const Joi = require('joi');

router.use(protect);

const createRecordSchema = Joi.object({
  userId: Joi.string().optional(),
  amount: Joi.number().positive().required(),
  type: Joi.string().valid('income', 'expense').required(),
  category: Joi.string().required(),
  date: Joi.date().iso().optional(),
  note: Joi.string().optional()
});

const updateRecordSchema = Joi.object({
  userId: Joi.string().optional(),
  amount: Joi.number().positive().optional(),
  type: Joi.string().valid('income', 'expense').optional(),
  category: Joi.string().optional(),
  date: Joi.date().iso().optional(),
  note: Joi.string().optional()
});

const getRecordsQuerySchema = Joi.object({
  type: Joi.string().valid('income', 'expense').optional(),
  category: Joi.string().optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional()
});

// Analysts & Admins can get records
router.get('/', authorizeRoles('analyst', 'admin'), validateQuery(getRecordsQuerySchema), getRecords);

// Only Admins can create/update/delete records
router.post('/', authorizeRoles('admin'), validate(createRecordSchema), createRecord);

router.route('/:id')
  .put(authorizeRoles('admin'), validate(updateRecordSchema), updateRecord)
  .delete(authorizeRoles('admin'), deleteRecord);

module.exports = router;
