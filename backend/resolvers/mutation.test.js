import Mutation from './mutation';
import {docClient} from '../aws';

const validUser = {
    password : 'patate',
    email : 'mmauny@atout.fr'
};

const hashedUser = {
    password : '$2a$10$4C47fWqweInpgFYBCq6Bu.izGgfG.e5YVktZ1M8IdOviRqgWvBRPe'
};

test('Signup basic', () => {
    docClient.put = jest.fn((params) => {
        expect(params.TableName).toBe('Users_');
        return {
            promise: () => {
            }
        };
    });
    return Mutation.signup({}, validUser).then(result => {
        expect(result.token).toBeDefined();
        expect(result.user.password).toBeDefined();
    })
});

test('Login basic', () => {
    docClient.get = jest.fn((params) => {
        expect(params.TableName).toBe('Users_');
        expect(params.ExpressionAttributeValues[":email"]).toBe(validUser.email);
        return {
            promise: () => new Promise((resolve) => {
                resolve([hashedUser])
            })
        };
    });
    return Mutation.login({}, validUser).then(result => {
        expect(result.token).toBeDefined();
        expect(result.user.password).not.toBeDefined();
    })
});