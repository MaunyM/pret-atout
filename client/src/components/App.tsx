import * as React from 'react';
import {Route, Switch} from "react-router";

import '../styles/App.css';

import BillListComponent from "./BillList";
import CreateBillComponent from "./CreateBill";
import HeaderComponent from "./Header";



class App extends React.Component {
    public render() {
        return (
            <div className="App">
                <HeaderComponent/>
                <Switch>
                    <Route exact={true} path="/" component={BillListComponent} />
                    <Route exact={true} path="/create" component={CreateBillComponent} />
                </Switch>
            </div>
        );
    }
}

export default App;
