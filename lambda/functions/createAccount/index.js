const MongoClient = require("mongodb").MongoClient;

const USER = process.env.USER;
const PASS = process.env.PASS;

const MONGODB_URI = `mongodb+srv://${USER}:${PASS}@cluster0.t0awyrc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

let cachedDb = null;

const USER_EXISTS_ERROR = {
  statusCode: 400,
  headers: {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  },
  body: "Username already exists",
};

const USER_CREATED_SUCCESS = {
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  },
  body: "Account created successfully",
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

  const account = JSON.parse(event.body);

  const db = await connectToDatabase();
  const users = db.collection("users");

  const cursor = await users.find({ user: account.username });
  if (await cursor.hasNext()) {
    return USER_EXISTS_ERROR;
  }

  await users.insertOne({
    user: account.username,
    pwd: account.password,
    receipts: [],
  });

  return USER_CREATED_SUCCESS;
};
