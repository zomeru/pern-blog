import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient } from '@prisma/client';

import { typeDefs } from './schema';
import { Query, Mutation } from './resolvers';
import { getUserFromToken } from './utils';

const prisma = new PrismaClient();

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
    },
  });

  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      const userInfo = await getUserFromToken(
        req.headers.authorization as string
      );

      return {
        prisma,
        userInfo,
      };
    },
  });

  console.log(`🚀  Server started at ${url}`);
};

main();
