// Tiny helpers enforcing the shared { success, data, message } / { success, message, errors } shape.
const success = (res, data = null, message = '', status = 200) =>
  res.status(status).json({ success: true, data, message });

const error = (res, message = 'Something went wrong', status = 500, errors = []) =>
  res.status(status).json({ success: false, message, errors });

module.exports = { success, error };
