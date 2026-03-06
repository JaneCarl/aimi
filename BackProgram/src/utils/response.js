const response = (res, code, message, data = null) => {
  res.json({
    code,
    message,
    data
  });
};

const success = (res, data = null, message = 'success') => {
  response(res, 200, message, data);
};

const error = (res, message = '操作失败', code = 500) => {
  response(res, code, message, null);
};

const unauthorized = (res, message = '未授权') => {
  response(res, 401, message, null);
};

const forbidden = (res, message = '无权限') => {
  response(res, 403, message, null);
};

const notFound = (res, message = '资源不存在') => {
  response(res, 404, message, null);
};

const badRequest = (res, message = '请求参数错误') => {
  response(res, 400, message, null);
};

module.exports = {
  response,
  success,
  error,
  unauthorized,
  forbidden,
  notFound,
  badRequest
};
