import * as React from 'react';
import {Route, Switch} from "react-router";

import LudoNochoiceComponent from "./Choice";
import CreateLudoComponent from "./CreateLudo";
import JoinLudoComponent from "./JoinLudo";

interface IProps {
    match?: {
        url: string
    }
}

class LudoNoComponent extends React.Component<IProps> {

    public render() {
        const {match} = this.props;
        return (
            <div>
                {match && (<Switch>
                    <Route path={`${match.url}/create`} component={CreateLudoComponent}/>}
                    <Route path={`${match.url}/join`} component={JoinLudoComponent}/>}
                    <Route path={`${match.url}`} component={LudoNochoiceComponent}/>}
                </Switch>)}
            </div>
        );
    }
}

export default LudoNoComponent;
