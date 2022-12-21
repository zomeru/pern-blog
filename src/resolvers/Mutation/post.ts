import type { Post, Prisma } from '@prisma/client';
import type { Context } from '../..';
import { canUserMutatePost } from '../../utils';

interface PostArgs {
  title: string;
  content: string;
}

interface PostPayloadType {
  userErrors: { message: string }[];
  post: Post | Prisma.Prisma__PostClient<Post, never> | null;
}

export const postResolvers = {
  postCreate: async (
    _: any,
    { post }: { post: PostArgs },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [{ message: 'You must be logged in to create a post' }],
        post: null,
      };
    }

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
          authorId: userInfo.userId,
        },
      }),
    };
  },
  postUpdate: async (
    _: any,
    { postId, post }: { postId: string; post: PostArgs },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    const { title, content } = post;

    const userAuthorized = await canUserMutatePost({
      userId: userInfo?.userId as number,
      postId: Number(postId),
      prisma,
    });

    if (!postId || !userAuthorized) {
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

    let data: PostArgs = {} as PostArgs;

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
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    const userAuthorized = await canUserMutatePost({
      userId: userInfo?.userId as number,
      postId: Number(postId),
      prisma,
    });

    if (!postId || !userAuthorized) {
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
  postPublish: async (
    _: any,
    { postId, isPublish }: { postId: number; isPublish: boolean },
    { prisma, userInfo }: Context
  ) => {
    const userAuthorized = await canUserMutatePost({
      userId: userInfo?.userId as number,
      postId: Number(postId),
      prisma,
    });

    if (!postId || !userAuthorized || !userInfo) {
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

    return {
      userErrors: [],
      post: prisma.post.update({
        where: { id: Number(postId) },
        data: {
          published: isPublish,
        },
      }),
    };
  },
};
