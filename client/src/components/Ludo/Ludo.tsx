import * as React from 'react';

import {Header, Segment} from "semantic-ui-react";

import '../../styles/Bill.css';
import {Ludo} from "../../types";

interface IProps {
    ludo: Ludo
}

class LudoComponent extends React.Component<IProps> {
    public render() {
        const {ludo} = this.props;
        return (
            <Segment>
                <Header as='h3'>Bienvenue à {ludo.name} {ludo.edge}</Header>
            </Segment>
        )
    }
}

export default LudoComponent;

