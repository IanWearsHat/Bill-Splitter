const MongoClient = require("/opt/node_modules/mongodb").MongoClient;
const bcrypt = require("/opt/node_modules/bcryptjs");

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

const INCORRECT_PASSWORD = {
  statusCode: 400,
  headers: {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  },
  body: "Login unsuccessful",
};

const LOGIN_SUCCESSFUL = {
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  },
  body: "Login successful",
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
  if (!(await cursor.hasNext())) {
    return USER_NOT_EXISTS_ERROR;
  }

  const dbAccount = await cursor.next();
  const result = await new Promise((resolve, reject) => {
    bcrypt.compare(account.password, dbAccount.pwd, function (err, bcryptResp) {
      if (err) reject(err);
      resolve(bcryptResp);
    });
  });

  if (result === false) {
    return INCORRECT_PASSWORD;
  }
  return LOGIN_SUCCESSFUL;
};
