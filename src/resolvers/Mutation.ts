import type { Post } from '@prisma/client';
import type { Context } from '../index';

interface PostCreateArgs {
  title: string;
  content: string;
}

interface PostPayloadType {
  userError: { message: string }[];
  post: Post | null;
}

export const Mutation = {
  postCreate: async (
    _: any,
    { title, content }: PostCreateArgs,
    { prisma }: Context
  ): Promise<PostPayloadType> => {
    if (!title || !content) {
      return {
        userError: [{ message: 'Title and content are required' }],
        post: null,
      };
    }

    try {
      const post = await prisma.post.create({
        data: {
          title,
          content,
          authorId: 1,
        },
      });
      return {
        userError: [],
        post,
      };
    } catch (error: any) {
      return {
        userError: [{ message: error.message }],
        post: null,
      };
    }
  },
};
