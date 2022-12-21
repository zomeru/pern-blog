import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient } from '@prisma/client';

import { typeDefs } from './schema';
import { Query, Mutation, Profile, Post, User } from './resolvers';
import { getUserFromToken } from './utils';

export const prisma = new PrismaClient();

export interface Context {
  prisma: typeof prisma;
  userInfo: {
    userId: number;
  } | null;
}

const main = async () => {
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers: {
      Query,
      Mutation,
      Profile,
      Post,
      User,
    },
  });

  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      const userInfo = await getUserFromToken(
        req.headers.authorization as string
      );

      console.log('userInfo', userInfo);

      return {
        prisma,
        userInfo,
      };
    },
  });

  console.log(`🚀  Server started at ${url}`);
};

main();
