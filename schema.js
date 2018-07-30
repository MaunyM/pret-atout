import { resolvers } from './resolver';
import { makeExecutableSchema } from 'graphql-tools';
import typeDefs from './schema.graphql'

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});