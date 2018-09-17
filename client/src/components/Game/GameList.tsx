import * as React from 'react';

import {Card} from 'semantic-ui-react';

import ApolloClient from 'apollo-client';
import {withApollo} from "react-apollo";

import '../../styles/Game.css';
import {Game, Ludo, User} from "../../types";
import GameComponent from "./Game";



interface IProps {
    client: ApolloClient<any>,
    me: User,
    ludo: Ludo,
    games: Game[]
}

class GameListComponent extends React.Component<IProps> {
    public render() {
        const {games} = this.props;
        return (
            <Card.Group itemsPerRow={3}>
                {games.map((game: Game) => (
                    <GameComponent key={game.box && game.box.handle || game.handle || game.bggId} {...this.props} game={game}/>
                ))}
            </Card.Group>
        )
    }
}

export default withApollo(GameListComponent);
