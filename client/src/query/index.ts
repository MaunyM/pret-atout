import gql from 'graphql-tag';

export {ADD_GAME_TO_LUDO_MUTATION, CREATE_LUDO_MUTATION, LUDOS_QUERY, JOIN_LUDO_MUTATION} from './ludo';

export const SEARCH_GAMES = gql`
    query SearchGames($filter: String!){
        searchGames(filter:$filter)
        {
            handle,
            name,
            bggId,
            thumbnail,
            maxPlayer,
            minPlayer
        }
    }
`;

export const BOXES_QUERY = gql`
    query Boxes($ludoHandle: String!) {
        boxes(ludoHandle: $ludoHandle) {
            handle,
            borrow {
                end
            },
            game {
                handle,
                name,
                bggId,
                thumbnail,
                maxPlayer,
                minPlayer
            }
        }
    }`;

export const CREATE_GAME_MUTATION = gql`
    mutation CreateGame($game: GameInput!) {
        createGame(game: $game) {
            handle,
            name
        }
    }`;

export const ME_QUERY = gql`
    {
        me {
            name,
            ludos {
                handle,
                name,
                edge
            }
        }
    }
`;



