import * as React from 'react';

import {DataProxy} from 'apollo-cache';
import ApolloClient from 'apollo-client';
import {withApollo} from "react-apollo";

import {Divider, Icon, Popup} from 'semantic-ui-react';

import {ADD_GAME_TO_LUDO_MUTATION, BOXES_QUERY, CREATE_GAME_MUTATION} from "../../query";
import {Box, Game, Ludo, User} from "../../types";

import {IBoxesResult} from "../../types/result/BoxesResult";

interface IProps {
    client: ApolloClient<any>;
    ludo: Ludo;
    me?: User;
    game: Game;
    onClick?: (g: Game) => void;
}

const updateBoxesStore = (ludoHandle?: string) => (store: DataProxy, {data: {addGameToLudo: box}}: { data: { addGameToLudo: Box } }) => {
    if (ludoHandle) {
        const data = store.readQuery<IBoxesResult>({query: BOXES_QUERY, variables: {ludoHandle}});
        if (data) {
            store.writeQuery(
                {
                    data: {...data, boxes: [{...box, borrow: null}, ...data.boxes]},
                    query: BOXES_QUERY,
                    variables: {ludoHandle}
                }
            )
        }
    }
};

class GameOwnerFooterComponent extends React.Component<IProps> {
    public render() {
        return (
            <div>
                <Divider/>
                <Popup
                    trigger={<Icon name='warehouse' link={true} color={'teal'}
                                   onClick={this.addGameToLudo}/>}
                    content='Ajouter une boite à ma ludotèque.'
                    position='top center'
                    on='hover'
                />
            </div>
        )
    }

    public cardClick = () => {
        if (this.props.onClick) {
            this.props.onClick(this.props.game);
        }
    };

    private addGameToLudo = async () => {
        const {game, ludo} = this.props;
        const gameToAdd: Game = {...game};
        if (!gameToAdd.handle) {
            // A game from bgg
            const apolloResponse = await this.props.client.mutate<Game>({
                mutation: CREATE_GAME_MUTATION,
                variables: {game}
            });
            if (apolloResponse.data && apolloResponse.data.createGame) {
                gameToAdd.handle = apolloResponse.data.createGame.handle;
            }
        }
        const gameInput = {...gameToAdd, __typename: undefined, boxHandle: undefined, box: undefined};
        await this.props.client.mutate<Game>({
            mutation: ADD_GAME_TO_LUDO_MUTATION,
            update: updateBoxesStore(ludo.handle),
            variables: {game: gameInput, ludoHandle: ludo.handle},
        });
    }
}

export default withApollo(GameOwnerFooterComponent);
