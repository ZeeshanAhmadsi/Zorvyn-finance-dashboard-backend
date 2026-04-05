const Record = require('../models/Record');

// 1. Overview Summary (Total Income, Total Expense, Net Balance)
const getSummary = async (req, res, next) => {
  try {
    const summary = await Record.aggregate([
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" }
        }
      }
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    summary.forEach(item => {
      if (item._id === 'income') totalIncome = item.total;
      if (item._id === 'expense') totalExpense = item.total;
    });

    res.json({
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense
    });
  } catch (error) {
    next(error);
  }
};

// 2. Category Breakdown
const getCategoryBreakdown = async (req, res, next) => {
  try {
    const breakdown = await Record.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    const formatted = {};
    breakdown.forEach(item => {
      formatted[item._id] = item.total;
    });

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

// 3. Monthly Trends
const getMonthlyTrends = async (req, res, next) => {
  try {
    const trends = await Record.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" },
            type: "$type"
          },
          total: { $sum: "$amount" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    const formattedTrends = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    trends.forEach(item => {
      const monthStr = `${monthNames[item._id.month - 1]} ${item._id.year}`;
      if (!formattedTrends[monthStr]) {
        formattedTrends[monthStr] = { month: monthStr, income: 0, expense: 0 };
      }
      formattedTrends[monthStr][item._id.type] = item.total;
    });

    res.json(Object.values(formattedTrends));
  } catch (error) {
    next(error);
  }
};

// 4. Recent Transactions
const getRecentActivity = async (req, res, next) => {
  try {
    const recent = await Record.find()
      .sort({ date: -1 })
      .limit(5)
      .populate('userId', 'name email');

    res.json(recent);
  } catch (error) {
    next(error);
  }
};

module.exports = { getSummary, getCategoryBreakdown, getMonthlyTrends, getRecentActivity };
