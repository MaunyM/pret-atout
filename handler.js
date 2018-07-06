'use strict';
const server = require("apollo-server-lambda");
const schema = require('./schema');

exports.graphql = server.graphqlLambda((event, context) => {
    const headers = event.headers;
    const functionName = context.functionName;

    return {
        schema: schema,
        context: {
            headers,
            functionName,
            event,
            context
        }
    };
});

exports.graphiql = server.graphiqlLambda({
    endpointURL: '/dev/graphql'
});

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
