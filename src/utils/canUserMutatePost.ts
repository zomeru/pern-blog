import type { Context } from '../';

interface UserMutatePostParams {
  userId: number;
  postId: number;
  prisma: Context['prisma'];
}

export const canUserMutatePost = async ({
  userId,
  postId,
  prisma,
}: UserMutatePostParams) => {
  try {
    const userExists = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userExists) {
      return false;
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post || post.authorId !== userId) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};
