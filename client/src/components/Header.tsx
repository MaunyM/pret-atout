import * as React from 'react';

import { ApolloClient } from 'apollo-client';
import {withApollo} from "react-apollo";
import {NavLink} from 'react-router-dom';
import {Button, Icon, Menu} from "semantic-ui-react";

import 'semantic-ui-css/semantic.min.css';

import {removeUserData} from "../service/user";
import {User} from "../types";

interface IProps {
    client: ApolloClient<any>,
    me: User,
    history: any
}

class HeaderComponent extends React.Component<IProps> {

    constructor(props: IProps) {
        super(props);
        this.logout = this.logout.bind(this);
    }

    public render() {
        const {me} = this.props;
        return (
            <Menu fixed={'top'}>
                <Menu.Item header={true} className={'pretAtout'}>Prêt Atout</Menu.Item>
                <NavLink className='item teal' to="/home/ludo">
                    <Icon name={'warehouse'}/>
                    Ma ludothèque
                </NavLink>
                <NavLink className='item purple' to="/home/game">
                    <Icon name={'cubes'}/>
                    Les jeux
                </NavLink>
                <NavLink className='item red' to="/home/billing">
                    <Icon name={'money bill alternate'}/>
                    Facturations
                </NavLink>
                <Menu.Menu position='right'>
                    <Menu.Item>
                        <Icon name='user'/>{me.name}
                    </Menu.Item>
                    <Menu.Item>
                        <Button primary={true} onClick={this.logout}>Déconnexion</Button>
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        )
    }

    private logout() {
        this.props.client.resetStore();
        removeUserData();
        this.props.history.push(`/`)
    }
}

export default withApollo(HeaderComponent);
