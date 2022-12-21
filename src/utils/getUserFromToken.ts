import JWT from 'jsonwebtoken';

export const getUserFromToken = (token: string) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET as string;
    return JWT.verify(token, JWT_SECRET) as {
      userId: number;
    };
  } catch (error) {
    return null;
  }
};
