import {byHandle} from "../repository/ludo";

const name = async ({handle}) => {
    const ludo = await byHandle(handle);
    return ludo.name;
};

module.exports = {
    name
};