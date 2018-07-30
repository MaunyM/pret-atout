import * as React from 'react'
import {ChangeEvent} from "react";
import {Mutation} from "react-apollo";

import gql from 'graphql-tag';

const ADD_BILL_MUTATION = gql`
    mutation AddUser($name: String!, $description: String!) {
        createBill(name: $name, description: $description) {
            handle
        }
    }`;

interface IProps {
    history: any
}

class CreateBillComponent extends React.Component<IProps> {

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
            <div>
                <input
                    value={name}
                    onChange={this.onNameChange}
                    type="text"
                    placeholder="Le nom"
                />
                <input
                    value={description}
                    onChange={this.onDescriptionChange}
                    type="text"
                    placeholder="La description"
                />
                <Mutation
                    mutation={ADD_BILL_MUTATION}
                    variables={{name, description}}
                    onCompleted={this.back}
                >{
                    addUserMutation => <button onClick={this.onSubmit(addUserMutation)}>Submit</button>
                }
                </Mutation>
                {this.state.name}
            </div>
        )
    }

    private back() {
        this.props.history.push('/')
    }

    private onSubmit(callback: () => void) {
        return () => callback();
    }

    private onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({name: e.target.value})
    };

    private onDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({description: e.target.value})
    };
}

export default CreateBillComponent;