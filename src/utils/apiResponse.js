const successResponse = (res, data = null, message = "OK", status = 200) => {
  return res.status(status).json({
    success: true,
    data,
    message,
  });
};

const errorResponse = (
  res,
  message = "Server Error",
  status = 500,
  errors = null
) => {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};