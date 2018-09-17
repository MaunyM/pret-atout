import * as React from 'react'
import {Mutation} from "react-apollo";

import {Button, Form, Segment} from 'semantic-ui-react';

import gql from 'graphql-tag';
import {onSubmit} from "../../service/forms";
import {Bill} from "../../types";
import {BILLS_QUERY} from "./HomeQuery";

const CREATE_BILL_MUTATION = gql`
    mutation CreateBill($name: String!, $description: String!) {
        createBill(name: $name, description: $description) {
            handle,
            name,
            description
        }
    }`;

interface IProps {
    history: any
}

class CreateBillComponent extends React.Component<IProps> {

    private static updateStore(store: any, {data: {createBill: bill}}: { data: { createBill: Bill } }) {
        const data = store.readQuery({query: BILLS_QUERY});
        store.writeQuery(
            {
                data: {...data, bills: [bill, ...data.bills]},
                query: BILLS_QUERY
            }
        )
    }

    public state = {
        description: '',
        name: ''
    };

    constructor(props: IProps) {
        super(props);
        this.back = this.back.bind(this);
    }

    public render() {
        const {name, description} = this.state;
        return (
            <Segment className={'Bill-create'}>
                <Form>
                    <Form.Field>
                        <label>Nom</label>
                        <input
                            value={name}
                            onChange={this.onNameChange}
                            type="text"
                            placeholder="Nom"
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Description</label>
                        <input
                            value={description}
                            onChange={this.onDescriptionChange}
                            type="text"
                            placeholder="Description"
                        />
                    </Form.Field>
                    <Mutation
                        mutation={CREATE_BILL_MUTATION}
                        variables={{name, description}}
                        onCompleted={this.back}
                        update={CreateBillComponent.updateStore}
                    >{
                        addGameMutation => <Button color={'red'} type={'submit'} onClick={onSubmit(addGameMutation)}>Envoyer</Button>
                    }
                    </Mutation>
                </Form>
            </Segment>
        )
    }

    private back() {
        this.props.history.push('/home/billing/list')
    }

    private onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({name: e.target.value})
    };

    private onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({description: e.target.value})
    };
}

export default CreateBillComponent;