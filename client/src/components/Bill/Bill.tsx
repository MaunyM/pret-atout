import * as React from 'react';

import {Card} from "semantic-ui-react";

import {Bill} from "../../types";

import '../../styles/Bill.css';

interface IProps {
    bill: Bill
}

class BillComponent extends React.Component<IProps> {
    public render() {
        return (
            <Card className={'bill'}>
                <Card.Content>
                    <Card.Header>{this.props.bill.name}</Card.Header>
                </Card.Content>
                <Card.Content>
                    {this.props.bill.description}
                </Card.Content>

            </Card>
        )
    }
}

export default BillComponent;

