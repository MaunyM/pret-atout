import AWSXRay from "aws-xray-sdk";
import dynamodb from "serverless-dynamodb-client";

export let docClient;

if (process.env.NODE_ENV === 'production') {
    const AWS = AWSXRay.captureAWS(require('aws-sdk'));
    docClient = new AWS.DynamoDB.DocumentClient();
} else {
    docClient = dynamodb.doc;
}