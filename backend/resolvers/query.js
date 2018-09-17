import {docClient} from "../aws";
import {TABLE_GAME} from "../constant";
import {secure} from "../jwt";
import {words} from "lodash";
import {all} from "../repository/ludo";

const bills = () => docClient.scan({TableName: 'Bills'}).promise().then(data => data.Items);
const games = () => docClient.scan({TableName: 'Games'}).promise().then(data => data.Items);
const ludos = () => all();
const ludo = (_, args) => {
    return docClient.get({
            TableName: 'Ludos',
            Key: {
                handle: args.handle,
                target: args.handle
            }
        }
    ).promise().then(data => data.Item);
};

const boxes = (_, args) => {
    const params = {
        TableName: 'Ludos',
        KeyConditionExpression: "handle = :handle and begins_with(#trgt, :box)",
        ExpressionAttributeNames: {
            "#trgt": "target"
        },
        ExpressionAttributeValues: {
            ":handle": args.ludoHandle,
            ":box": "box"
        }
    };
    return docClient.query(params).promise().then(data => data.Items.map(item => ({...item, handle: item.target})));
};

const searchGames = (_, args) => {
    const params = {
        TableName: TABLE_GAME,
        FilterExpression: "#srch = :filter or contains(#srch, :filter)",
        ExpressionAttributeNames: {
            "#srch": "search"
        },
        ExpressionAttributeValues: {
            ":filter": args.filter.toLowerCase()
        }
    };
    return docClient.scan(params).promise().then(data => data.Items)
};


let me = (parent, args) => {
    try {
        const {userId} = args;
        const params = {
            TableName: 'Ludos',
            KeyConditionExpression: "handle = :userId and target = :userId",
            ExpressionAttributeValues: {
                ":userId": userId
            }
        };
        return docClient.query(params).promise().then(data => data.Items[0]);
    } catch (e) {
        return (e);
    }
};

me = secure(me);

module.exports = {
    bills,
    games,
    searchGames,
    boxes,
    ludo,
    ludos,
    me,
};