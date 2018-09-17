import * as React from 'react';
import {Redirect, Route, Switch} from "react-router";

import {debounce, unionWith, words} from 'lodash';

import ApolloClient from 'apollo-client';
import {withApollo} from "react-apollo";

import {Grid, Header, Icon, Input, Message, Segment} from "semantic-ui-react";

import '../../styles/Game.css';
import {Box, Game, Ludo, User} from "../../types";
import CreateGameComponent from "./GameCreate";
import GameListComponent from "./GameList";

import {BOXES_QUERY, SEARCH_GAMES} from "../../query";
import {fetchSearch, fetchSearchExact, isEqual, mapToGame} from "../../service/game";
import {isOwner} from "../../service/ludo";
import {BggGame} from "../../types";

interface IProps {
    client: ApolloClient<any>,
    me: User,
    ludo: Ludo,
    match?: {
        url: string
    }
}

interface IState {
    filteredGames: Game[];
    loading: boolean;
    ludosGames?: Game[];
    query: string;
    noBox: boolean;
}

const gamesRender = (games: Game[], me: User, ludo: Ludo) => (props: any) => {
    return (
        <GameListComponent me={me} games={games} ludo={ludo} {...props}/>);
};

const filterGame = (game: Game, filter: string) => game.name && words(game.name.toLowerCase()).join(" ").includes(filter);

interface ISearchGamesResult {
    searchGames: Game[];
}

class GameHomeComponent extends React.Component<IProps, IState> {

    public state: IState = {
        filteredGames: [],
        loading: false,
        noBox: false,
        query: ''
    };

    private searchRef = React.createRef<Input>();

    private MAX_RESULT = 9;

    public constructor(props: IProps) {
        super(props);
        this.onQueryChange = debounce(this.onQueryChange, 1000);
    }

    public async componentDidMount() {
        const {ludo} = this.props;
        if (ludo && ludo.handle) {
            this.props.client.watchQuery<any>({
                query: BOXES_QUERY,
                variables: {ludoHandle: ludo.handle}
            }).subscribe(({data: {boxes}}) => {
                    const ludosGames: Game[] = boxes.map((box: Box) => ({...box.game, box} as Game));
                    this.setState({
                        filteredGames: ludosGames.filter((game: Game) => filterGame(game, this.state.query)),
                        ludosGames,
                        noBox: false
                    });
                }
            );
        }

    }

    public render() {
        const {match, me, ludo} = this.props;
        const {filteredGames, noBox, loading, ludosGames} = this.state;
        return (
            <div className="Game-home page">
                <Segment>
                    <Grid columns='two'>
                        <Grid.Column width={4}>
                            <Header as='h2' color='purple'>
                                <Icon name={'cubes'}/>
                                <Header.Content>
                                    Les jeux
                                    <Header.Subheader>à emprunter</Header.Subheader>
                                </Header.Content>
                            </Header>
                        </Grid.Column>
                        <Grid.Column width={12} verticalAlign='middle'>
                            <Input className='icon'
                                   icon='search'
                                   fluid={true}
                                   autoFocus={true}
                                   loading={loading}
                                   disabled={loading}
                                   ref={this.searchRef}
                                   placeholder='Rechercher...'
                                   onChange={this.handleChange}/>
                        </Grid.Column>
                    </Grid>
                </Segment>
                <div>
                    {noBox && ludo && filteredGames.length !== 0 && <Message>
                        <Message.Header>Ces jeux ne sont pas encore dans votre ludothèque</Message.Header>
                        <p>
                            Vous pouvez les ajouter en cliquant sur : <Icon name='warehouse' color={'teal'}/>
                        </p>
                    </Message>}
                    {ludosGames && !loading && filteredGames.length === 0 && <Message>
                        <Message.Header>Aucun résultat</Message.Header>
                    </Message>}
                    {match && (<Switch>
                        <Route path={`${match.url}/list`} render={gamesRender(filteredGames, me, ludo)}/>}
                        <Route path={`${match.url}/create`} component={CreateGameComponent}/>}
                        <Redirect to={`${match.url}/list`}/>
                    </Switch>)
                    }
                </div>
            </div>
        );
    }

    private focus = () => this.searchRef.current && this.searchRef.current.focus();

    private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        this.setState({query}, () => {
            this.onQueryChange(query);
        })
    };

    private onQueryChange = async (query: string) => {
        const filter = query.toLowerCase();
        const {ludo} = this.props;
        let games: Game[] = [];
        this.setState({loading: true});
        if (this.state.ludosGames) {
            const filteredBox = this.state.ludosGames.filter((game: Game) => filterGame(game, filter));
            games = [...filteredBox];
            this.setState({filteredGames: games})
        }
        if (isOwner(ludo) && games.length < this.MAX_RESULT) {
            const filteredGames = await this.executeFilteredGamesSearch(filter);
            games = unionWith(games, filteredGames.slice(0, this.MAX_RESULT - games.length), isEqual);
            this.setState({filteredGames: games})
        }
        if (isOwner(ludo) && games.length < this.MAX_RESULT) {
            const bggGames = await this.executeBggGamesSearch(filter);
            games = unionWith(games, bggGames.slice(0, this.MAX_RESULT - games.length), isEqual)
        }
        this.setState({filteredGames: games, loading: false}, this.focus);
    };

    private executeFilteredGamesSearch = async (filter: string): Promise<Game[]> => {
        if (filter && filter.length > 2) {
            const result = await this.props.client.query<ISearchGamesResult>({
                query: SEARCH_GAMES,
                variables: {filter}
            });
            return result.data.searchGames;
        }
        return [];
    };

    private executeBggGamesSearch = async (filter: string): Promise<Game[]> => {
        if (filter && filter.length > 2) {
            let games: BggGame[] = await fetchSearchExact(filter);
            if (!games.length) {
                games = await fetchSearch(filter);
            }
            return games.map(mapToGame);
        }
        return [];
    };
}

export default withApollo(GameHomeComponent);
