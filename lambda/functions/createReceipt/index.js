const MongoClient = require("/opt/node_modules/mongodb").MongoClient;
const { verifyToken } = require("/opt/authentication.js");

const USER = process.env.USER;
const PASS = process.env.PASS;

const MONGODB_URI = `mongodb+srv://${USER}:${PASS}@cluster0.t0awyrc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const { v4: uuidv4 } = require("uuid");

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

const RECEIPT_CREATED_SUCCESS = {
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  },
  body: "Receipt creation successful",
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

function generateUniqueId() {
  return uuidv4().replace(/-/g, "");
}

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
  const cursor = await users.find({ user: user });
  if (!(await cursor.hasNext())) {
    return USER_NOT_EXISTS_ERROR;
  }

  const { token, ...receiptData } = body;

  const newReceipt = {
    id: generateUniqueId(),
    ...receiptData,
  };

  const result = await users.updateOne(
    { user: user },
    { $push: { receipts: newReceipt } }
  );

  console.log(`Updated ${result.modifiedCount} document`);
  return RECEIPT_CREATED_SUCCESS;
};
