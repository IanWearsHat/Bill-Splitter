const { verifyToken } = require("/opt/authentication.js");

const NO_TOKEN = {
  statusCode: 200,
  body: "",
};

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const body = JSON.parse(event.body);

  let user;
  try {
    const decoded = await verifyToken(body.token);
    user = decoded.user;
  } catch (err) {
    return NO_TOKEN;
  }

  const response = {
    statusCode: 200,
    body: user,
  };
  return response;
};
