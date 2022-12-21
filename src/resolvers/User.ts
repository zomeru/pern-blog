import type { Context } from '..';

interface UserParent {
  id: number;
}

export const User = {
  posts: (
    parent: UserParent,
    { skip, take }: { skip: number; take: number },
    { prisma, userInfo }: Context
  ) => {
    const isOwnProfile = parent.id === userInfo?.userId;

    if (isOwnProfile) {
      return prisma.post.findMany({
        where: {
          authorId: parent.id,
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        skip,
        take,
      });
    }

    return prisma.post.findMany({
      where: {
        authorId: parent.id,
        published: true,
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      skip,
      take,
    });
  },
};
