const Record = require('../models/Record');

const createRecord = async (req, res, next) => {
  try {
    const { amount, type, category, date, note } = req.body;
    
    // Admins can specify userId, others use their own id (in case we allow others to create later)
    const userId = (req.user.role === 'admin' && req.body.userId) ? req.body.userId : req.user._id;

    const record = await Record.create({
      userId,
      amount,
      type,
      category,
      date: date || new Date(),
      note
    });

    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

const getRecords = async (req, res, next) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 10 } = req.query;
    
    // Viewer doesn't have access usually, but let's assume they can't access records at all, only admin/analyst.
    let query = {};
    if (type) query.type = type;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const records = await Record.find(query)
      .populate('userId', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ date: -1 });

    const total = await Record.countDocuments(query);

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
      data: records
    });
  } catch (error) {
    next(error);
  }
};

const updateRecord = async (req, res, next) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) {
      res.status(404);
      throw new Error('Record not found');
    }

    const updatedRecord = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedRecord);
  } catch (error) {
    next(error);
  }
};

const deleteRecord = async (req, res, next) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) {
      res.status(404);
      throw new Error('Record not found');
    }
    await Record.deleteOne({ _id: record._id });
    res.json({ message: 'Record removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createRecord, getRecords, updateRecord, deleteRecord };
