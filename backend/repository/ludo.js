import {docClient} from "../aws";
import {EDGE_MEMBER, EDGE_OWNER, PREFIX_LUDO, TABLE_LUDO} from "../constant";

export const byUserId = async (userId) => {
    try {
        const params = {
            TableName: TABLE_LUDO,
            IndexName: 'target-index',
            KeyConditionExpression: "#trg = :userId and #dg = :owner",
            ExpressionAttributeNames: {
                "#trg": "target",
                "#dg": "edge"
            },
            ExpressionAttributeValues: {
                ":userId": userId,
                ":owner": EDGE_OWNER
            }
        };
        const memberParams = {
            TableName: TABLE_LUDO,
            IndexName: 'target-index',
            KeyConditionExpression: "#trg = :userId and #dg = :member",
            ExpressionAttributeNames: {
                "#trg": "target",
                "#dg": "edge"
            },
            ExpressionAttributeValues: {
                ":userId": userId,
                ":member": EDGE_MEMBER
            }
        };
        const [owned, member] = await Promise.all([
            docClient.query(params).promise().then(data => data.Items),
            docClient.query(memberParams).promise().then(data => data.Items)
        ]);
        return [...owned, ...member];
    } catch (e) {
        return (e);
    }
};

export const byHandle = (handle) => {
    try {
        const params = {
            TableName: TABLE_LUDO,
            Key: {
                handle: handle,
                target: handle
            }

        };
        return docClient.get(params).promise().then(data => data.Item);
    } catch (e) {
        return (e);
    }
};

export const all = () => {
    try {
        const params = {
            TableName: 'Ludos',
            FilterExpression: "begins_with(#trgt, :prefix)",
            ExpressionAttributeNames: {
                "#trgt": "target"
            },
            ExpressionAttributeValues: {
                ":prefix": PREFIX_LUDO
            }
        };
        return docClient.scan(params).promise().then(data => data.Items);
    } catch (e) {
        return (e);
    }
};
