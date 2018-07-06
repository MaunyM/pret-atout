'use strict';
const server = require("apollo-server-lambda");
const schema = require('./schema');


exports.graphqlHandler = function(event, context, callback) {
    const callbackFilter = function(error, output) {
        output.headers['Access-Control-Allow-Origin'] = '*';
        callback(error, output);
    };
    const handler = server.graphqlLambda({ schema: schema });

    return handler(event, context, callbackFilter);
};


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
