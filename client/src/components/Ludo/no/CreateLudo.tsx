import * as React from 'react'
import {Mutation} from "react-apollo";

import {Button, Form, Header, Icon, Segment} from 'semantic-ui-react';

import {CREATE_LUDO_MUTATION, ME_QUERY} from "../../../query";
import {onSubmit} from "../../../service/forms";
import {Ludo} from "../../../types";

interface IProps {
    history: any
}

interface IState {
    ludo: Ludo
}


class CreateLudoComponent extends React.Component<IProps, IState> {

    private static updateStore(store: any, {data: {createLudo: ludo}}: { data: { createLudo: Ludo } }) {
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

    constructor(props: IProps) {
        super(props);
    }

    public render() {
        const {ludo} = this.state;
        return (
            <div>
                <Segment>
                    <Header as='h2' color='teal'>
                        <Icon name='warehouse'/>
                        <Header.Content>
                            Ma ludothèque
                            <Header.Subheader>Ouverture</Header.Subheader>
                        </Header.Content>
                    </Header>
                </Segment>
                <Segment className={'Bill-create'}>
                    <Form>
                        <Form.Field>
                            <label>Nom</label>
                            <input
                                value={ludo.name || ''}
                                autoFocus={true}
                                onChange={this.onChange('name')}
                                type="text"
                                placeholder="Nom"
                            />
                        </Form.Field>
                        <Mutation
                            mutation={CREATE_LUDO_MUTATION}
                            variables={{ludo}}
                            onCompleted={this.back}
                            update={CreateLudoComponent.updateStore}
                        >{
                            addLudoMutation => <Button color={'teal'} type={'submit'}
                                                       onClick={onSubmit(addLudoMutation)}>Ouvrir</Button>
                        }
                        </Mutation>
                    </Form>
                </Segment>
            </div>
        )
    }

    private back = () => this.props.history.push('/home/ludo');

    private onChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ludo: {...this.state.ludo, [field]: e.target.value}});
    };
}

export default CreateLudoComponent;