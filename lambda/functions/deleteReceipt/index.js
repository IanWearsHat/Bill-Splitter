const MongoClient = require("/opt/node_modules/mongodb").MongoClient;
const { verifyToken } = require("/opt/authentication.js");

const USER = process.env.USER;
const PASS = process.env.PASS;

const MONGODB_URI = `mongodb+srv://${USER}:${PASS}@cluster0.t0awyrc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

let cachedDb = null;

const USER_NOT_EXISTS_ERROR = {
  statusCode: 400,
  headers: {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  },
  body: "Account not found",
};

const RECEIPT_DELETED_SUCCESS = {
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  },
  body: "Receipt deleted successfully",
};

const RECEIPT_NOT_FOUND_ERROR = {
  statusCode: 400,
  headers: {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  },
  body: "Receipt not found",
};

const USER_MISMATCH_ERROR = {
  statusCode: 400,
  headers: {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  },
  body: "User in token does not match creator of receipt",
};

const INVALID_TOKEN_ERROR = {
  statusCode: 400,
  headers: {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  },
  body: "Token error. Try logging in again.",
};

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(MONGODB_URI);

  const db = await client.db("insertDB");

  cachedDb = db;
  return db;
}

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const body = JSON.parse(event.body);

  // verify token
  let user;
  try {
    const decoded = await verifyToken(body.token);
    user = decoded.user;
  } catch (err) {
    return INVALID_TOKEN_ERROR;
  }

  const db = await connectToDatabase();
  const users = db.collection("users");

  const { token, receiptID } = body;

  const cursor = await users.findOne(
    { "receipts.id": receiptID },
    { projection: { user: 1 } }
  );

  if (cursor && cursor.user) {
    if (cursor.user == user) {
      const result = await users.updateOne(
        { "receipts.id": receiptID },
        { $pull: { receipts: { id: receiptID } } }
      );
      if (result.modifiedCount == 0) {
        return RECEIPT_NOT_FOUND_ERROR;
      }
      return RECEIPT_DELETED_SUCCESS;
    }
    return USER_MISMATCH_ERROR;
  }

  return USER_NOT_EXISTS_ERROR;
};
