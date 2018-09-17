import * as React from 'react';
import {Redirect, Route, Switch} from "react-router";

import ApolloClient from 'apollo-client';
import {Query, withApollo} from "react-apollo";

import {ME_QUERY} from "../query";
import {removeUserData} from "../service/user";
import {User} from "../types";
import BillHomeQueryComponent from "./Bill/HomeQuery";
import GameHomeComponent from "./Game/Home";
import HeaderComponent from "./Header";
import LudoHomeComponent from "./Ludo/Home";
import LudoNoComponent from "./Ludo/no/NoLudo";

interface IProps {
    client: ApolloClient<any>
    history: any
    match: {
        url: string
    }
}

const ludoRender = (me: User) => (props: any): JSX.Element => me.ludos.length ? (
    <LudoHomeComponent me={me} ludo={me.ludos[0]} {...props} />
) : (
    <LudoNoComponent {...props}/>
);

const gameHomeRender = (me: User) => (props: any): JSX.Element => (
    <GameHomeComponent me={me} ludo={me.ludos[0]} {...props}/>);


class HomeComponent extends React.Component<IProps> {
    public render() {
        const {match} = this.props;
        return (
            <Query query={ME_QUERY} fetchPolicy={"network-only"}>
                {
                    ({loading, error, data}) => {
                        if (loading) {
                            return <div>Connexion</div>
                        }
                        if (error) {
                            return <div>{removeUserData()}<Redirect to={`/`}/></div>
                        }
                        return (
                            <div className="Home">
                                <HeaderComponent me={data.me} {...this.props}/>
                                <div className="content">
                                    <Switch>
                                        <Route path={`${match.url}/ludo`} render={ludoRender(data.me)}/>}
                                        <Route path={`${match.url}/game`} render={gameHomeRender(data.me)}/>}
                                        <Route path={`${match.url}/billing`} component={BillHomeQueryComponent}/>}
                                        <Redirect to={`${match.url}/ludo`}/>
                                    </Switch>
                                </div>
                            </div>
                        );
                    }
                }
            </Query>
        );
    }
}

export default withApollo(HomeComponent);
