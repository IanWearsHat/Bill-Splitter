const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

async function generateToken(username) {
  const data = {
    user: username,
  };

  const result = await new Promise((resolve, reject) => {
    jwt.sign(data, JWT_SECRET, { expiresIn: "1h" }, function (err, token) {
      if (err) reject(err);
      resolve(token);
    });
  });
  return result;
}

async function verifyToken(token) {
  const result = await new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, function (err, decoded) {
      if (err) reject(err);
      resolve(decoded);
    });
  });
  return result;
}

module.exports = { generateToken, verifyToken };
