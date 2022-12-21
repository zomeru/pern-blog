import { userLoader } from '../loaders';

interface PostParent {
  authorId: number;
}

export const Post = {
  user: (parent: PostParent) => {
    return userLoader.load(parent.authorId);
  },
};
