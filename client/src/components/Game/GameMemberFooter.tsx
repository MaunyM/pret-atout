import * as React from 'react';

import {DataProxy} from 'apollo-cache';
import ApolloClient from 'apollo-client';
import {withApollo} from "react-apollo";

import {Divider, Icon, Popup} from 'semantic-ui-react';

import {BOXES_QUERY} from "../../query";
import {BORROW_BOX} from "../../query/ludo";
import {Borrow, Box, Game, Ludo, User} from "../../types";
import {IBoxesResult} from "../../types/result/BoxesResult";

interface IProps {
    client: ApolloClient<any>;
    ludo: Ludo;
    me?: User;
    game: Game;
    onClick?: (g: Game) => void;
}

const updateBoxesStore = (borrowedbox: Box, ludoHandle?: string) => (store: DataProxy, {data: {borrowBox: borrow}}: { data: { borrowBox: Borrow } }) => {
    if (ludoHandle) {
        const data = store.readQuery<IBoxesResult>({query: BOXES_QUERY, variables: {ludoHandle}});
        if (data) {
            data.boxes.find((box: Box) => borrowedbox.handle === box.handle);
            const boxes = data.boxes.map((box: Box) => borrowedbox.handle === box.handle ? {...box, borrow} : {...box});
            if (data) {
                store.writeQuery(
                    {
                        data: {...data, boxes},
                        query: BOXES_QUERY,
                        variables: {ludoHandle}
                    }
                )
            }
        }
    }
};


class GameMemberFooterComponent extends React.Component<IProps> {
    public render() {
        const {game} = this.props;
        return (
            <div>
                {this.canBorrow(game) &&
                <div>
                    <Divider/>
                    <Popup
                        trigger={this.borrowIcon()}
                        content='Emprunter'
                        position='top center'
                        on='hover'
                    />
                </div>
                }
            </div>
        )

    }

    public cardClick = () => {
        if (this.props.onClick) {
            this.props.onClick(this.props.game);
        }
    };

    private canBorrow = (game: Game) => !(game.box && game.box.borrow);

    private borrowIcon = () => (
        <Icon name='cube' onClick={this.borrow} color={'purple'}/>
    );

    private borrow = async () => {
        const {game, ludo} = this.props;
        if (game.box) {
            await this.props.client.mutate<Game>({
                mutation: BORROW_BOX,
                update: updateBoxesStore(game.box, ludo.handle),
                variables: {handle: game.box.handle},
            });
        }
    }
}

export default withApollo(GameMemberFooterComponent);
