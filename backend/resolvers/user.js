import {byUserId} from "../repository/ludo";

const ludos = async (user) => await byUserId(user.handle);

module.exports = {
    ludos
};