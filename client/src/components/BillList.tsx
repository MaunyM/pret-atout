import * as React from 'react';

import gql from 'graphql-tag';
import {Query} from 'react-apollo'

import '../styles/App.css';
import {Bill} from "../types";
import BillComponent from "./Bill";



const BILLS_QUERY = gql`
    {
        bills {
            name
        }
    }
`;

class UserListComponent extends React.Component {
    public render() {
        return (
            <Query query={BILLS_QUERY}>
                {
                    ({loading, error, data}) => {
                        if (loading) {
                            return <div>Fetching</div>
                        }
                        if (error) {
                            return <div>Error</div>
                        }
                        return data.bills.map((bill: Bill, index: number) => (
                            <BillComponent key={index} bill={bill}/>)
                        )
                    }
                }
            </Query>
        )
    }
}

export default UserListComponent;
