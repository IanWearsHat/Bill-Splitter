const MongoClient = require("/opt/node_modules/mongodb").MongoClient;
const { verifyToken } = require("/opt/authentication.js");

const USER = process.env.USER;
const PASS = process.env.PASS;

const MONGODB_URI = `mongodb+srv://${USER}:${PASS}@cluster0.t0awyrc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

let cachedDb = null;

const RECEIPT_NOT_FOUND_ERROR = {
  statusCode: 400,
  headers: {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  },
  body: "Receipt not found",
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

  let user = "";
  try {
    const decoded = await verifyToken(body.token);
    user = decoded.user;
  } catch (err) {}

  const db = await connectToDatabase();

  const users = db.collection("users");
  const cursor = await users.findOne(
    { "receipts.id": body.receiptID },
    { projection: { user: 1, "receipts.$": 1 } }
  );
  if (cursor)
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: JSON.stringify({
        isSameUser: cursor.user == user,
        buyers: cursor.receipts[0].buyers,
        items: cursor.receipts[0].items,
        finalItems: cursor.receipts[0].finalItems,
        receiptName: cursor.receipts[0].receiptName,
      }),
    };
  return RECEIPT_NOT_FOUND_ERROR;
};
