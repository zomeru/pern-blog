import React from "react";
import "./Post.css";
import { gql, useMutation } from "@apollo/client";

const SET_PUBLISH_POST = gql`
  mutation PublishPost($postId: ID!, $isPublish: Boolean!) {
    postPublish(postId: $postId, isPublish: $isPublish) {
      post {
        title
      }
    }
  }
`;

export default function Post({
  title,
  content,
  date,
  user,
  published,
  id,
  isMyProfile,
}) {
  const [setPublishPost, { data, loading }] = useMutation(SET_PUBLISH_POST);

  console.log("data publish", data);

  const formatedDate = new Date(Number(date));
  return (
    <div
      className="Post"
      style={published === false ? { backgroundColor: "hotpink" } : {}}
    >
      {isMyProfile && published === false && (
        <button
          className="Post__publish"
          onClick={() => {
            setPublishPost({
              variables: {
                postId: id,
                isPublish: true,
              },
            });
          }}
        >
          publish
        </button>
      )}
      {isMyProfile && published === true && (
        <button
          className="Post__publish"
          onClick={() => {
            setPublishPost({
              variables: {
                postId: id,
                isPublish: false,
              },
            });
          }}
        >
          unpublish
        </button>
      )}
      <div className="Post__header-container">
        <h2>{title}</h2>
        <h4>
          Created At {`${formatedDate}`.split(" ").splice(0, 3).join(" ")} by{" "}
          {user}
        </h4>
      </div>
      <p>{content}</p>
    </div>
  );
}
