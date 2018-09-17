import * as React from 'react';
import {Redirect, Route, Switch} from "react-router";

import '../styles/App.css';

import {readUserData} from "../service/user";
import HomeComponent from "./Home";
import LoginComponent from "./Login";

import * as moment from 'moment';
import 'moment/locale/fr';
moment.locale('fr');

const loginRender = (props: any) => (<LoginComponent login={true} {...props}/>);
const signupRender = (props: any) => (<LoginComponent login={false} {...props}/>);

class App extends React.Component {
    public render() {
        const connected: boolean = readUserData() !== null;
        return (
            <div className={'App'}>
                <Switch>
                    {connected && <Route path="/home" component={HomeComponent}/>}
                    <Route path="/signup" render={signupRender}/>
                    {connected && <Redirect to="/home"/>}
                    <Route path="/" render={loginRender}/>}
                </Switch>
            </div>
        );
    }
}

export default App;
