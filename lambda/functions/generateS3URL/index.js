const { verifyToken } = require("/opt/authentication.js");

// generateURL
const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const REGION = "us-east-2";
const BUCKET = "receipts-profile-images";

const INVALID_TOKEN_ERROR = {
  statusCode: 400,
  headers: {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  },
  body: "Token error. Try logging in again.",
};

const createPresignedUrlWithClient = async (region, bucket, key) => {
  const client = new S3Client({ region: region });
  const command = new PutObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 3600 });
};

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const body = JSON.parse(event.body);

  let user;
  try {
    const decoded = await verifyToken(body.token);
    user = decoded.user;
  } catch (err) {
    return INVALID_TOKEN_ERROR;
  }

  const resolvedURL = await createPresignedUrlWithClient(
    REGION,
    BUCKET,
    user + ".png"
  );

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: JSON.stringify({ resolvedURL: resolvedURL, user: user }),
  };
};
