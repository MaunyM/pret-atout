import uuidv1 from 'uuid/v1';
import bcrypt from 'bcryptjs';
import {docClient} from '../aws';
import {secure, sign} from "../jwt";
import {TABLE_LUDO, EDGE_OWNER, EDGE_BOX, EDGE_MEMBER, EXCEPTION_NO_BOX, EXCEPTION_ALREADY_BORROWED} from "../constant";
import {words} from "lodash";
import {byHandle} from "../repository/ludo";
import BoxRepo from "../repository/box";
import moment from 'moment';

let createBill = async (root, args) => {
    const params = {TableName: 'Bills', Item: {...args, handle: uuidv1()}};
    await docClient.put(params).promise();
    return params.Item;
};

let createLudo = async (root, args) => {
    const handle = `ludo-${uuidv1()}`;
    let params = {TableName: TABLE_LUDO, Item: {...args.ludo, handle, target: handle}};
    let edgeParams = {TableName: TABLE_LUDO, Item: {...args.ludo, handle, target: args.userId, edge: EDGE_OWNER}};
    await Promise.all([docClient.put(params).promise(), docClient.put(edgeParams).promise()]);
    return {...params.Item, edge: EDGE_OWNER};
};

let joinLudo = async (root, args) => {
    let edgeParams = {TableName: TABLE_LUDO, Item: {handle: args.handle, target: args.userId, edge: EDGE_MEMBER}};
    await docClient.put(edgeParams).promise();
    return byHandle(args.handle);
};

let borrowBox = async (_, args) => {
    const boxes = await BoxRepo.byHandle(args.handle);
    const box = boxes[0];
    if (!box) {
        throw EXCEPTION_NO_BOX;
    }
    if (box.borrow) {
        throw EXCEPTION_ALREADY_BORROWED;
    }
    const borrow = {
        start: moment().unix(),
        end: moment().add(1, "weeks").unix(),
    };
    const params = {
        TableName: TABLE_LUDO,
        Key: {
            handle: box.handle,
            target: args.handle,
        },
        UpdateExpression: "set borrow = :b",
        ExpressionAttributeValues: {
            ":b": borrow
        },
        ReturnValues: "UPDATED_NEW"
    };
    const boxUpdated = await docClient.update(params).promise().then(data => data.Attributes.borrow);
    console.log(' result box', boxUpdated);
    return boxUpdated;
};


let createGame = async (root, args) => {
    const params = {
        TableName: 'Games',
        Item: {...args.game, handle: uuidv1(), search: words(args.game.name.toLowerCase()).join(' ')}
    };
    await docClient.put(params).promise();
    return params.Item;
};

let addGameToLudo = async (root, args) => {
    const handle = `box-${uuidv1()}`;
    let params = {
        TableName: TABLE_LUDO,
        Item: {
            ...args.game,
            handle: args.ludoHandle,
            gameHandle: args.game.handle,
            target: handle,
            edge: EDGE_BOX
        }
    };
    await docClient.put(params).promise();
    return {handle, game: args.game};
};

let signup = async (parent, args) => {
    try {
        const password = await bcrypt.hash(args.password, 10);
        const handle = `user-${uuidv1()}`;
        const params = {TableName: TABLE_LUDO, Item: {...args, search: args.email, password, handle, target: handle}};
        await docClient.put(params).promise();
        const token = sign({userId: params.Item.handle});
        return {
            token,
            user: params.Item
        }
    } catch (e) {
        return {e}
    }
};

let login = async (parent, args) => {
    const params = {
        TableName: 'Ludos',
        IndexName: 'search-index',
        KeyConditionExpression: "#sr = :email",
        ExpressionAttributeNames: {
            "#sr": "search"
        },
        ExpressionAttributeValues: {
            ":email": args.email
        }
    };
    const response = await docClient.query(params).promise();
    const user = response.Items[0];
    if (!user) {
        throw new Error('No such user found')
    }
    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) {
        throw new Error('Invalid password')
    }
    const token = sign({userId: user.handle});
    return {
        token,
        user: {...user, password: undefined}
    }
};

createBill = secure(createBill);
createGame = secure(createGame);
createLudo = secure(createLudo);
joinLudo = secure(joinLudo);
addGameToLudo = secure(addGameToLudo);
borrowBox = secure(borrowBox);

module.exports = {
    createBill,
    createGame,
    createLudo,
    joinLudo,
    addGameToLudo,
    borrowBox,
    signup,
    login,
};