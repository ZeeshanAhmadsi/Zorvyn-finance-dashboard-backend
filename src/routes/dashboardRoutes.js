const express = require('express');
const router = express.Router();
const { getSummary, getCategoryBreakdown, getMonthlyTrends, getRecentActivity } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');

router.use(protect);

// Viewer, Analyst, and Admin all have access to the dashboard
router.use(authorizeRoles('viewer', 'analyst', 'admin'));

router.get('/summary', getSummary);
router.get('/categories', getCategoryBreakdown);
router.get('/trends', getMonthlyTrends);
router.get('/recent', getRecentActivity);

module.exports = router;
