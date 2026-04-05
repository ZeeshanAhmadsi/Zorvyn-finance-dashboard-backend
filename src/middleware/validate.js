const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body || {}, { abortEarly: false });
    if (error) {
      return res.status(400).json({ error: error.details.map(d => d.message).join(', ') });
    }
    next();
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query, { abortEarly: false, allowUnknown: true });
    if (error) {
      return res.status(400).json({ error: error.details.map(d => d.message).join(', ') });
    }
    next();
  }
}

module.exports = { validate, validateQuery };
