import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App';
import './styles/index.css';

import registerServiceWorker from './registerServiceWorker';

import {InMemoryCache} from 'apollo-cache-inmemory'
import {ApolloClient} from 'apollo-client'
import {createHttpLink} from 'apollo-link-http'
import gql from 'graphql-tag';
import {ApolloProvider} from 'react-apollo'
import {BrowserRouter} from "react-router-dom";

const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT
});

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink
});

const variables = {
    consumer_key: process.env.REACT_APP_CONSUMER_KEY,
    consumer_secret: process.env.REACT_APP_SECRET_KEY,
};
// tslint:disable-next-line:no-console
client.query({query: gql`{ users{name} }`, variables}).then(console.log);

ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App/>
        </ApolloProvider>
    </BrowserRouter>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
