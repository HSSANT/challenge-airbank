import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers, createGqlContext } from "../graphql";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: createGqlContext,
});

export default server;
