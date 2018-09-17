import {verify} from "./jwt";

exports.handler = function (event, context, callback) {
    try {
        const token = event.authorizationToken;
        let authorizerContext;
        // Entire API call the same function
        // The resolver have the responsibility to check the user information.
        if (token !== 'no-auth') {
            const {userId} = verify(token);
            authorizerContext = {userId};
        }
        const policyDocument = buildIAMPolicy("userId", 'Allow', event.methodArn, authorizerContext);
        callback(null, policyDocument);
    } catch (e) {
        callback('Unauthorized')
    }
};

/**
 * Returns an IAM policy document for a given user and resource.
 *
 * @method buildIAMPolicy
 * @param {String} userId - user id
 * @param {String} effect  - Allow / Deny
 * @param {String} resource - resource ARN
 * @param {String} context - response context
 * @returns {Object} policyDocument
 */
const buildIAMPolicy = (userId, effect, resource, context) => {
    return {
        principalId: userId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource,
                },
            ],
        },
        context,
    };
};