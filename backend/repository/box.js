import {docClient} from "../aws";
import {EDGE_BOX, TABLE_LUDO} from "../constant";

const byHandle = (handle) => {
    if (handle) {
        try {
            const params = {
                TableName: TABLE_LUDO,
                IndexName: 'target-index',
                KeyConditionExpression: "target = :handle and edge = :box",
                ExpressionAttributeValues: {
                    ":handle": handle,
                    ":box": EDGE_BOX
                }
            };
            return docClient.query(params).promise().then(data => {
                return data.Items
            });
        } catch (e) {
            return (e);
        }
    }
};

export default {
    byHandle
}
