import * as React from 'react'
import {Redirect, Route, Switch} from "react-router";

import GameFormComponent from "./GameForm";

interface IProps {
    match?: {
        url: string
    },
    history: any
}

class CreateGameComponent extends React.Component<IProps> {
    public render(): React.ReactNode {
        const {match} = this.props;
        return (
            <div>
                {match && (<Switch>
                    <Route path={`${match.url}/form`} render={this.gameFormRender}/>}
                    <Redirect to={`${match.url}/form`}/>
                </Switch>)}
            </div>
        )
    }

    private gameFormRender = (props: any) => {
        return (<GameFormComponent game={props.location.state.game} {...props}/>);
    }
}

export default CreateGameComponent;