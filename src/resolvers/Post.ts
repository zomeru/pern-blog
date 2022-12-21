import type { Context } from 'src';

interface PostParent {
  authorId: number;
}

export const Post = {
  user: (parent: PostParent, __: any, { prisma }: Context) => {
    return prisma.user.findUnique({
      where: {
        id: parent.authorId,
      },
    });
  },
};
