import * as React from 'react';
import {Mutation} from "react-apollo";

import {ApolloError} from 'apollo-client';
import gql from 'graphql-tag';

import {Button, Card, Input, Popup} from "semantic-ui-react";

import {onSubmit} from "../service/forms";
import {saveUserData} from "../service/user";
import {Bill} from "../types";

import '../styles/Login.css';

interface IProps {
    bill?: Bill,
    history?: any,
    login: boolean
}

interface IState {
    email: string,
    name: string,
    password: string,
    wrongPassword: boolean,
    noUserFound: boolean,
}


const SIGNUP_MUTATION = gql`
    mutation SignupMutation($email: String!, $password: String!, $name: String!) {
        signup(email: $email, password: $password, name: $name) {
            token
        }
    }`;

const LOGIN_MUTATION = gql`
    mutation LoginMutation($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token, user {name}
        }
    }`;

class LoginComponent extends React.Component<IProps, IState> {
    public state: IState = {
        email: '',
        name: '',
        noUserFound: false,
        password: '',
        wrongPassword: false,
    };
    private nameRef: React.RefObject<Input>;

    constructor(props: IProps) {
        super(props);
        this.nameRef = React.createRef();
    }

    public render() {
        const {email, password, name, noUserFound, wrongPassword} = this.state;
        const {login} = this.props;
        return (
            <div className={'login-component'}>
                <Card>
                    <Card.Content>
                        <Card.Header className={'pretAtout'}>Prêt Atout</Card.Header>
                        <Card.Meta>Connexion</Card.Meta>
                        {!login && (<Input
                            focus={true}
                            value={name}
                            onChange={this.onNameChange}
                            type="text"
                            placeholder="Nom"
                        />)}

                        <Popup content='Ce mail est inconnu' position='right center' className={'warning'}
                               trigger={
                                   <Input
                                       icon='mail'
                                       iconPosition='left'
                                       focus={true}
                                       value={email}
                                       onChange={this.onEmailChange}
                                       onFocus={this.onMailFocus}
                                       type="text"
                                       ref={this.nameRef}
                                       placeholder="Mail"
                                   />}
                               open={noUserFound}/>
                        <Popup content="Le mot de passe est incorrect" position='right center' className={'warning'}
                               open={wrongPassword}
                               trigger={
                                   <Input
                                       icon='lock'
                                       iconPosition='left'
                                       value={password}
                                       onFocus={this.onPasswordFocus}
                                       onChange={this.onPasswordChange}
                                       type="password"
                                       placeholder="Mot de passe"
                                   />}
                        />
                    </Card.Content>
                    <Mutation
                        mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
                        variables={{email, password, name}}
                        onCompleted={this.confirm}
                        onError={this.onError}
                    >
                        {mutation => (
                            <Card.Content extra={true}>
                                <Button primary={true} onClick={onSubmit(mutation)}>
                                    {login ? 'Connexion' : 'Créer un compte'}
                                </Button>
                            </Card.Content>
                        )}
                    </Mutation>
                </Card>
            </div>
        )
    }

    private onError = (message: ApolloError) => {
        if (message.graphQLErrors[0].message === "No such user found") {
            this.setState({noUserFound: true})
        }
        if (message.graphQLErrors[0].message === "Invalid password") {
            this.setState({wrongPassword: true})
        }
    };

    private onMailFocus = () => this.setState({noUserFound: false});

    private onPasswordFocus = () => this.setState({wrongPassword: false});

    private onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({name: e.target.value})
    };

    private onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({email: e.target.value})
    };

    private onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({password: e.target.value})
    };

    private confirm = (data: any) => {
        const {token} = this.props.login ? data.login : data.signup;
        saveUserData(token);
        this.props.history.push(`/`);
    };

}

export default LoginComponent;
