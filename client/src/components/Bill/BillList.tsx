import * as React from 'react';

import {Card} from 'semantic-ui-react';

import {Bill} from "../../types";
import BillComponent from "./Bill";

import '../../styles/Bill.css';

interface IProps {
    bills: Bill[];
}

class BillListComponent extends React.Component<IProps> {
    public render() {
        const {bills} = this.props;
        return (
            <div className={'Bill-list'}>
                <div className={'content'}>
                    {bills && <Card.Group>
                        {bills.map((bill: Bill, index: number) => (
                            <BillComponent key={index} bill={bill}/>
                        ))}
                    </Card.Group>
                    }
                </div>
            </div>
        )
    }
}

export default BillListComponent;
