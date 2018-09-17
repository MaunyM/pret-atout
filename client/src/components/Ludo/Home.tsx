import * as React from 'react';

import {Header, Icon} from "semantic-ui-react";

import '../../styles/Game.css';
import {Ludo} from "../../types";
import LudoComponent from "./Ludo";

interface IProps {
    ludo: Ludo
    match?: {
        url: string
    }
}

class LudoHomeComponent extends React.Component<IProps> {

    public render() {
        const {ludo} = this.props;
        return (
            <div className="Ludo-home page">
                <Header as='h2' attached={'top'} color={'teal'}>
                    <Icon name={'warehouse'}/>
                    <Header.Content>
                        Ma ludothèque
                    </Header.Content>
                </Header>
                <div className={'sub-page'}>
                    <LudoComponent ludo={ludo}/>
                </div>
            </div>
        );
    }
}

export default LudoHomeComponent;
