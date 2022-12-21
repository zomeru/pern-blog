import DataLoader from 'dataloader';
import type { User } from '@prisma/client';
import { prisma } from '../';

type BatchUser = (ids: number[]) => Promise<(User | undefined)[]>;

const batchUsers: BatchUser = async (ids) => {
  console.log('batchUsers', ids);

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  const userMap: { [key: number]: User } = {};

  users.forEach((user) => {
    userMap[user.id] = user;
  });

  return ids.map((id) => userMap[id]);
};

// @ts-ignore
export const userLoader = new DataLoader<number, User>(batchUsers);
