import gql from "graphql-tag";

export const ADD_GAME_TO_LUDO_MUTATION = gql`
    mutation AddGameToLudo($game:GameInput!,$ludoHandle:String!){
        addGameToLudo(game:$game,ludoHandle:$ludoHandle) {
            handle,
            game {
                handle,
                name,
                bggId,
                thumbnail,
                maxPlayer,
                minPlayer
            }}
    }`;

export const BORROW_BOX = gql`
    mutation BorrowBox($handle:String!){
        borrowBox(handle:$handle) {
            start,end}
    }`;

export const CREATE_LUDO_MUTATION = gql`
    mutation CreateLudo($ludo: LudoInput!) {
        createLudo(ludo: $ludo) {
            handle,
            name,
            edge
        }
    }`;

export const JOIN_LUDO_MUTATION = gql`
    mutation JoinLudo($handle: String!) {
        joinLudo(handle: $handle) {
            handle,
            name,
            edge
        }
    }`;

export const LUDOS_QUERY = gql`
    {
        ludos {
            name,
            handle
        }
    }
`;
