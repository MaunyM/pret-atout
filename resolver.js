import dynamodb from 'serverless-dynamodb-client';

import AWSXRay from 'aws-xray-sdk';

import uuidv1 from 'uuid/v1';


let docClient;

if (process.env.NODE_ENV === 'production') {
    const AWS = AWSXRay.captureAWS(require('aws-sdk'));
    docClient = new AWS.DynamoDB.DocumentClient();
} else {
    docClient = dynamodb.doc;
}

let defaultBillParams = {
    TableName: 'Bills'
};

const bills = () => {
    return docClient.scan(defaultBillParams).promise().then(data => data.Items);
};

const createBill = (args) => {
    const params = {
        ...defaultBillParams, Item: { name: args.name,  description : args.description, handle: uuidv1()}
    };
    return docClient.put(params).promise().then(() => {
        return params.Item;
    })
};

export const resolvers = {
    Query: {
        bills: (root, args) => bills()
    },
    Mutation: {
        createBill: (root, args) => createBill(args)
    }
};