import jwt from "jsonwebtoken";

export const APP_SECRET = 'super-p4tate';

export const sign = (payload) => jwt.sign(payload, APP_SECRET);
export const verify = (token) => jwt.verify(token, APP_SECRET);

export const secure = (func) => async (event, args, context) => {
    try {
        const userId = context.requestContext.authorizer.userId;
        return func(event, {...args, userId});
    } catch (e) {
        return (e);
    }
};