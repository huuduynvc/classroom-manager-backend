const ajv = require('ajv');

module.exports = schema => (req, res, next) => {
  const validator = new ajv({
    allErrors: true
  });
  const fn_validate = validator.compile(schema);
  const isValid = fn_validate(req.body);
  if (!isValid) {
    return res.status(400).json(fn_validate.errors);
  }

  next();
}
