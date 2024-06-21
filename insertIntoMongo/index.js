// Import the MongoDB driver
const MongoClient = require("mongodb").MongoClient;

const USER = process.env.USER;
const PASS = process.env.PASS;

// Define our connection string. Info on where to get this will be described below. In a real world application you'd want to get this string from a key vault like AWS Key Management, but for brevity, we'll hardcode it in our serverless function here.
const MONGODB_URI =
  `mongodb+srv://${USER}:${PASS}@cluster0.t0awyrc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Once we connect to the database once, we'll store that connection and reuse it so that we don't have to connect to the database on every request.
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  // Connect to our MongoDB database hosted on MongoDB Atlas
  const client = await MongoClient.connect(MONGODB_URI);

  // Specify which database we want to use
  const db = await client.db("insertDB");

  cachedDb = db;
  return db;
}

exports.handler = async (event, context) => {

  /* By default, the callback waits until the runtime event loop is empty before freezing the process and returning the results to the caller. Setting this property to false requests that AWS Lambda freeze the process soon after the callback is invoked, even if there are events in the event loop. AWS Lambda will freeze the process, any state data, and the events in the event loop. Any remaining events in the event loop are processed when the Lambda function is next invoked, if AWS Lambda chooses to use the frozen process. */
  context.callbackWaitsForEmptyEventLoop = false;
  
  // const body = JSON.parse(event.body);
  // return {
  //   statusCode: 200,
  //   body: "Got " + JSON.stringify(body),
  // };

  // Get an instance of our database
  const db = await connectToDatabase();
  const haiku = db.collection("haiku");

  // Make a MongoDB MQL Query to go into the movies collection and return the first 20 movies.
  // const movies = await db.collection("movies").find({}).limit(20).toArray();
  const doc = {
      title: "Record of a Shriveled Datum",
      content: "No bytes, no problem. Just insert a document, in MongoDB",
    }
    // Insert the defined document into the "haiku" collection
  const result = await haiku.insertOne(doc);

  const response = {
    statusCode: 200,
    headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    },
    body: JSON.stringify(result),
  };

  return response;
};