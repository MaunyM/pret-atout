import {docClient} from "../aws";
import {TABLE_GAME} from "../constant";

export const byHandle = (handle) => {
    if (handle) {
        try {
            return docClient.get({
                    TableName: TABLE_GAME,
                    Key: {
                        handle: handle
                    }
                }
            ).promise().then(data => {
                return data.Item
            });
        } catch (e) {
            return (e);
        }
    }
};
