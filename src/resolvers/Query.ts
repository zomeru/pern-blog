import type { Context } from 'src';

export const Query = {
  hello: () => 'Hello World!',
  posts: (_: any, __: any, { prisma }: Context) => {
    return prisma.post.findMany({
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
  },
};
