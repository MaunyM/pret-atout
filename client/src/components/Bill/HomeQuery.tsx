import * as React from 'react';

import gql from 'graphql-tag';
import {Query} from "react-apollo";

import HomeComponent from "./Home";

interface IProps {
    match: {
        url: string
    }
}

export const BILLS_QUERY = gql`
    {
        bills {
            name,
            description
        }
    }
`;

class BillHomeQueryComponent extends React.Component<IProps> {
    public render() {
        return (
            <div className="Bill-home">
                <Query query={BILLS_QUERY}>
                    {
                        ({loading, error, data}) => {
                            if (loading) {
                                return <div>Fetching</div>
                            }
                            if (error) {
                                return <div>Error</div>
                            }
                            return (
                                <HomeComponent bills={data.bills} {...this.props}/>
                            );
                        }
                    }
                </Query>
            </div>
        );
    }
}

export default BillHomeQueryComponent;
