import * as React from 'react'

import {Mutation, Query} from "react-apollo";

import {Card, Header, Icon, Popup, Segment} from 'semantic-ui-react';

import {JOIN_LUDO_MUTATION, LUDOS_QUERY, ME_QUERY} from "../../../query";
import {onSubmit} from "../../../service/forms";
import {Ludo} from "../../../types";

interface IProps {
    history: any
}

interface IState {
    ludo: Ludo
}


class JoinLudoComponent extends React.Component<IProps, IState> {

    private static updateStore(store: any, {data: {joinLudo: ludo}}: { data: { joinLudo: Ludo } }) {
        const data = store.readQuery({query: ME_QUERY});
        store.writeQuery(
            {
                data: {...data, me: {...data.me, ludos: [...data.me.ludos, ludo]}},
                query: ME_QUERY
            }
        );
    }

    public state = {
        ludo: new Ludo()
    };

    public render() {
        return (
            <div>
                <Segment>
                    <Header as='h2' color='teal'>
                        <Icon name='warehouse'/>
                        <Header.Content>
                            Ma ludothèque
                            <Header.Subheader>Rejoindre</Header.Subheader>
                        </Header.Content>
                    </Header>
                </Segment>
                <Query query={LUDOS_QUERY}>
                    {
                        ({loading, error, data}) => {
                            if (loading) {
                                return <div>Fetching</div>
                            }
                            if (error) {
                                return <div>Error</div>
                            }
                            return <Card.Group itemsPerRow={3}>
                                {data.ludos.map((ludo: Ludo) => (
                                    <Card key={ludo.handle}>
                                        <Card.Content>
                                            <Card.Header>
                                                {ludo.name}
                                            </Card.Header>
                                        </Card.Content>
                                        <Card.Content extra={true}>
                                            <Mutation
                                                mutation={JOIN_LUDO_MUTATION}
                                                variables={{handle: ludo.handle}}
                                                onCompleted={this.back}
                                                update={JoinLudoComponent.updateStore}
                                            >{joinLudoMutation =>
                                                <Popup
                                                    trigger={this.joinIcon(joinLudoMutation)}
                                                    content='Rejoindre'
                                                    position='top center'
                                                    on='hover'
                                                />
                                            }
                                            </Mutation>
                                        </Card.Content>
                                    </Card>
                                ))}
                            </Card.Group>
                        }
                    }
                </Query>
            </div>
        )
    }

    private joinIcon = (mutation: any) => (
        <Icon.Group>
            <Icon name='warehouse' onClick={onSubmit(mutation)}/>
            <Icon corner={true} name='reply' color={'teal'}/>
        </Icon.Group>);

    private back = () => this.props.history.push('/home/ludo');
}

export default JoinLudoComponent;