import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BrowserRouter} from "react-router-dom";

import App from './components/App';
import './styles/index.css';

import registerServiceWorker from './registerServiceWorker';

import {InMemoryCache} from 'apollo-cache-inmemory'
import {ApolloClient} from 'apollo-client'
import {setContext} from 'apollo-link-context'
import {createHttpLink} from 'apollo-link-http'
import {ApolloProvider} from 'react-apollo'
import {readUserData} from "./service/user";


const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT
});

const authLink = setContext((_, {headers}) => {
    const authorization = readUserData() || 'no-auth';
    return {
        headers: {
            ...headers,
            authorization
        }
    };
});

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
});

ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App/>
        </ApolloProvider>
    </BrowserRouter>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
