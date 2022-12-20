import type { User } from '@prisma/client';
import bcrypt from 'bcryptjs';

import type { Context } from 'src';
import { emailValidator } from '../../utils';

interface SignupArgs {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  bio: string;
}

interface UserPayload {
  userErrors: {
    message: string;
  }[];
  user: User | null;
}

export const authResolvers = {
  signup: async (
    _: any,
    { email, password, passwordConfirm, name, bio }: SignupArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const validEmail = emailValidator(email);
    if (!validEmail) {
      return {
        userErrors: [{ message: 'Invalid email address' }],
        user: null,
      };
    }

    if (password !== passwordConfirm) {
      return {
        userErrors: [{ message: 'Passwords do not match' }],
        user: null,
      };
    }

    if (password.length < 8) {
      return {
        userErrors: [{ message: 'Password must be at least 8 characters' }],
        user: null,
      };
    }

    if (!name || !bio) {
      return {
        userErrors: [{ message: 'Name and bio are required' }],
        user: null,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        profile: {
          create: {
            bio,
          },
        },
      },
    });

    return {
      userErrors: [],
      user,
    };
  },
};
