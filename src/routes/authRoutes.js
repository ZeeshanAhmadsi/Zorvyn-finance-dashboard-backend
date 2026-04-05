const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { registerUser, loginUser } = require('../controllers/authController');
const { validate } = require('../middleware/validate');

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('viewer', 'analyst', 'admin').optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);

module.exports = router;
