import type { Post, Prisma } from '@prisma/client';
import type { Context } from 'src';

interface PostInputArgs {
  title: string;
  content: string;
}

interface PostPayloadType {
  userErrors: { message: string }[];
  post: Post | Prisma.Prisma__PostClient<Post, never> | null;
}

export const Mutation = {
  postCreate: async (
    _: any,
    { post }: { post: PostInputArgs },
    { prisma }: Context
  ): Promise<PostPayloadType> => {
    const { title, content } = post;

    if (!title || !content) {
      return {
        userErrors: [{ message: 'Title and content are required' }],
        post: null,
      };
    }

    return {
      userErrors: [],
      post: prisma.post.create({
        data: {
          title,
          content,
          authorId: 1,
        },
      }),
    };
  },
  postUpdate: async (
    _: any,
    { postId, post }: { postId: string; post: PostInputArgs },
    { prisma }: Context
  ): Promise<PostPayloadType> => {
    const { title, content } = post;

    if (!postId) {
      return {
        userErrors: [{ message: "Something wen't wrong." }],
        post: null,
      };
    }

    if (!title && !content) {
      return {
        userErrors: [{ message: 'Title or content is required' }],
        post: null,
      };
    }

    const postExists = await prisma.post.findUnique({
      where: { id: Number(postId) },
    });

    if (!postExists) {
      return {
        userErrors: [{ message: 'Post does not exist' }],
        post: null,
      };
    }

    let data: PostInputArgs = {} as PostInputArgs;

    if (title) data.title = title;
    if (content) data.content = content;

    return {
      userErrors: [],
      post: prisma.post.update({
        where: { id: Number(postId) },
        data,
      }),
    };
  },
  postDelete: async (
    _: any,
    { postId }: { postId: string },
    { prisma }: Context
  ): Promise<PostPayloadType> => {
    if (!postId) {
      return {
        userErrors: [{ message: "Something wen't wrong." }],
        post: null,
      };
    }

    const postExists = await prisma.post.findUnique({
      where: { id: Number(postId) },
    });

    if (!postExists) {
      return {
        userErrors: [{ message: 'Post does not exist' }],
        post: null,
      };
    }

    await prisma.post.delete({
      where: { id: Number(postId) },
    });

    return {
      userErrors: [],
      post: null,
    };
  },
};
