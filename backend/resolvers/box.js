import {byHandle} from "../repository/game";

const game = async (box) => {
    if(box.game) {
        return box.game
    }
    return await byHandle(box.gameHandle);
};

module.exports = {
    game
};