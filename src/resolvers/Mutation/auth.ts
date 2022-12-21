import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';

import type { Context } from 'src';
import { emailValidator } from '../../utils';

interface CredentialsInput {
  email: string;
  password: string;
}

interface SignupArgs {
  credentials: CredentialsInput;
  passwordConfirm: string;
  name: string;
  bio: string;
}

interface UserPayload {
  userErrors: {
    message: string;
  }[];
  token: string | null;
}

export const authResolvers = {
  signup: async (
    _: any,
    { credentials, passwordConfirm, name, bio }: SignupArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const { email, password } = credentials;

    const validEmail = emailValidator(email);
    if (!validEmail) {
      return {
        userErrors: [{ message: 'Invalid email address' }],
        token: null,
      };
    }

    if (password !== passwordConfirm) {
      return {
        userErrors: [{ message: 'Passwords do not match' }],
        token: null,
      };
    }

    if (password.length < 8) {
      return {
        userErrors: [{ message: 'Password must be at least 8 characters' }],
        token: null,
      };
    }

    if (!name || !bio) {
      return {
        userErrors: [{ message: 'Name and bio are required' }],
        token: null,
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

    const JWT_SECRET = process.env.JWT_SECRET as string;

    const token = JWT.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '7 days',
    });

    return {
      userErrors: [],
      token,
    };
  },
  signin: async (
    _: any,
    { credentials }: { credentials: CredentialsInput },
    { prisma }: Context
  ): Promise<UserPayload> => {
    const { email, password } = credentials;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    const invalidMessage = 'Invalid email or password';

    if (!user) {
      return {
        userErrors: [{ message: invalidMessage }],
        token: null,
      };
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      return {
        userErrors: [{ message: invalidMessage }],
        token: null,
      };
    }

    const JWT_SECRET = process.env.JWT_SECRET as string;

    const token = JWT.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '7 days',
    });

    return {
      userErrors: [],
      token,
    };
  },
};
