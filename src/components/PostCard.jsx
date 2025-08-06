import { Link } from "react-router";
import { formatInstagramTime } from "../lib/utils";
import PostStats from "./PostStats";
import { useAuth } from "../context/AuthContext";

const PostCard = ({ post }) => {
  const { user } = useAuth();

  if (!post.creator) {
    console.log("post.creator:", post);
    return;
  }

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.accountId}`}>
            <img
              src={
                post.creator?.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="w-12 object-cover h-12 rounded-full"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular ">
                {/* TODO: update time - it always showing "Just now" */}
                {formatInstagramTime(post.updatedAt)}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>

        <Link
          to={`/update-post/${post.imageId}`}
          className={`${user.accountId !== post.creator.accountId && "hidden"}`}
        >
          <img
            src={"/assets/icons/edit.svg"}
            alt="edit"
            width={20}
            height={20}
          />
        </Link>
      </div>
      <Link to={`/posts/${post.imageId}`}>
        <div className="small-medium text-ellipsis break-all lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag, index) => (
              <li key={`${tag}${index}`} className="text-light-3 small-regular">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <img
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="post image"
          className="post-card_img"
        />
      </Link>
      <PostStats post={post} userId={user.accountId} />
    </div>
  );
};

export default PostCard;
