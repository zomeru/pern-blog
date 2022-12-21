import type { Context } from 'src';

export const Query = {
  hello: () => 'Hello World!',
  me: (_: any, __: any, { prisma, userInfo }: Context) => {
    if (!userInfo) return null;

    return prisma.user.findUnique({
      where: {
        id: userInfo.userId,
      },
    });
  },
  profile: async (
    _: any,
    { userId }: { userId: string },
    { prisma }: Context
  ) => {
    const profile = await prisma.profile.findUnique({
      where: {
        userId: Number(userId),
      },
    });

    if (!profile) {
      return null;
    }

    return profile;
  },
  posts: (_: any, __: any, { prisma }: Context) => {
    return prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
  },
};
