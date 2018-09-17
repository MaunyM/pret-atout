import * as React from 'react';

import {Redirect, Route, Switch} from "react-router";
import {NavLink} from "react-router-dom";

import {Header, Icon, Input, Label, Menu} from "semantic-ui-react";

import {Bill} from "../../types";
import BillListComponent from "./BillList";
import CreateBillComponent from "./CreateBill";

import '../../styles/Bill.css';

interface IProps {
    bills: Bill[]
    match?: {
        url: string
    }
}

interface IState {
    filteredBills: Bill[]
}

const billsRender = (bills: Bill[]) => () => (<BillListComponent bills={bills}/>);

const filterBill = (bill: Bill, filter: string) => bill.name.toLowerCase().includes(filter);

class BillHomeComponent extends React.Component<IProps, IState> {
    public state: IState = {
        filteredBills: this.props.bills
    };

    public render() {
        const {match} = this.props;
        const {filteredBills} = this.state;
        return (
            <div className="Bill-home page">
                <Header as='h2' attached={'top'} color='red'>
                    <Icon name={'money bill alternate'}/>
                    <Header.Content>
                        Facturation
                        <Header.Subheader>En attente</Header.Subheader>
                    </Header.Content>
                </Header>
                <div className={'content'}>
                    <Menu vertical={true} attached={true}>
                        <NavLink className='item' to="/home/billing/list">
                            <Input className='icon' icon='search' placeholder='Rechercher...'
                                   onChange={this.onSearchChange}/>
                        </NavLink>
                        <NavLink className='item' to="/home/billing/list">
                            <Label color='red'>{filteredBills.length}</Label>
                            En attente
                        </NavLink>
                        <NavLink className='item' to="/home/billing/create">
                            Création
                        </NavLink>
                    </Menu>
                    <div className={'sub-page'}>
                        {match && (<Switch>
                            <Route path={`${match.url}/list`} render={billsRender(filteredBills)}/>}
                            <Route path={`${match.url}/create`} component={CreateBillComponent}/>}
                            <Redirect to={`${match.url}/list`}/>
                        </Switch>)
                        }
                    </div>
                </div>
            </div>
        );
    }

    private onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const filter = e.target.value.toLowerCase();
        this.setState({filteredBills: this.props.bills.filter((bill: Bill) => filterBill(bill, filter))})
    };
}

export default BillHomeComponent;
