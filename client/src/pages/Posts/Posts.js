import React from "react";
import Post from "../../components/Post/Post";
import { useQuery, gql } from "@apollo/client";

const GET_POSTS = gql`
  query {
    posts(skip: 0, take: 5) {
      id
      title
      content
      createdAt
      user {
        name
      }
    }
  }
`;

export default function Posts() {
  const { error, loading, data } = useQuery(GET_POSTS);

  console.log("error", error);
  console.log("data", data);

  if (error) return <div>Error Page</div>;

  if (loading) return <div>Spinner...</div>;

  const { posts } = data;

  return (
    <div>
      {posts.map((post) => {
        return (
          <Post
            title={post.title}
            content={post.content}
            date={post.createdAt}
            id={post.id}
            user={post.user.name}
          />
        );
      })}
    </div>
  );
}
