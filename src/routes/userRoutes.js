const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const { validate } = require('../middleware/validate');
const Joi = require('joi');

router.use(protect);
router.use(authorizeRoles('admin'));

const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  role: Joi.string().valid('viewer', 'analyst', 'admin').optional(),
  status: Joi.string().valid('active', 'inactive').optional()
});

router.route('/')
  .get(getUsers);

router.route('/:id')
  .get(getUserById)
  .put(validate(updateUserSchema), updateUser)
  .delete(deleteUser);

module.exports = router;
