import gql from 'graphql-tag';

export const typeDefs = gql`
  type Query {
    hello: String!
    posts: [Post!]!
  }

  type Mutation {
    postCreate(post: PostInput!): PostPayload!
    postUpdate(postId: ID!, post: PostInput!): PostPayload!
    postDelete(postId: ID!): PostPayload!
    postPublish(postId: ID!, isPublish: Boolean): PostPayload!
    signup(
      credentials: CredentialsInput!
      passwordConfirm: String!
      name: String!
      bio: String!
    ): AuthPayload!
    signin(credentials: CredentialsInput!): AuthPayload!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    published: Boolean!
    user: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    profile: Profile!
    posts: [Post!]!
  }

  type Profile {
    id: ID!
    bio: String!
    user: User!
  }

  type UserError {
    message: String!
  }

  type PostPayload {
    userErrors: [UserError!]!
    post: Post
  }

  type AuthPayload {
    userErrors: [UserError!]!
    token: String
  }

  input PostInput {
    title: String
    content: String
  }

  input CredentialsInput {
    email: String!
    password: String!
  }
`;
