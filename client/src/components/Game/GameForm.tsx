import * as React from 'react'

import {Mutation} from "react-apollo";

import {Button, Form, Grid, Icon, Image, Input, Segment} from "semantic-ui-react";

import {CREATE_GAME_MUTATION} from "../../query";
import {onSubmit} from "../../service/forms";
import {Game} from "../../types";

interface IProps {
    game: Game;
    history: any
}

interface IState {
    game: Game;
}

class GameFormComponent extends React.Component<IProps, IState> {
    public state = {
        game: this.props.game
    };

    constructor(props: IProps) {
        super(props);
        this.back = this.back.bind(this);
    }

    public render() {
        const {game} = this.state;
        const inputSize = 'small';
        return (
            <Segment className={'Game-create'}>
                <Form>
                    <Form.Field>
                        <label>Nom</label>
                        <Form.Input
                            size={inputSize}
                            value={game.name}
                            onChange={this.onChange('name')}
                            type="text"
                            placeholder="Nom"
                        />
                    </Form.Field>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={14}>
                                <Form.Field>
                                    <label>Miniature</label>
                                    <Form.Input
                                        size={inputSize}
                                        value={game.thumbnail}
                                        onChange={this.onChange('thumbnail')}
                                        type="url"
                                        placeholder="Lien vers une image"
                                    />
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Image src={game.thumbnail} centered={true} size='tiny'/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Form.Field inline={true} className={'players'}>
                        <Icon name='users'/>
                        <Input
                            size={inputSize}
                            value={game.minPlayer || ''}
                            onChange={this.onChange('minPlayer')}
                            type="number"
                            placeholder="Min"
                            min="1"
                            max="99"
                        />
                        -
                        <Input
                            size={inputSize}
                            value={game.maxPlayer || ''}
                            onChange={this.onChange('maxPlayer')}
                            type="number"
                            placeholder="Max"
                            min="1"
                            max="99"
                        />
                    </Form.Field>
                    <Mutation
                        mutation={CREATE_GAME_MUTATION}
                        variables={{game}}
                        onCompleted={this.back}
                    >{
                        addGameMutation => <Button color={'purple'} type={'submit'}
                                                   onClick={onSubmit(addGameMutation)}>Créer</Button>
                    }
                    </Mutation>
                </Form>
            </Segment>
        )
    }

    private onChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({game: {...this.state.game, [field]: e.target.value}});
    };

    private back() {
        this.props.history.push('/home/game/list')
    }
}

export default GameFormComponent;