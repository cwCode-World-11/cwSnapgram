import { Link } from "react-router";
import PostStats from "./PostStats";

const GridPostList = ({ posts, showUser = true, showStats = true }) => {
  const user = { id: "123" };
  return (
    <ul className="grid-container custom-scrollbar">
      {posts.map((post) => (
        <li key={post.$id} className="relative min-w-80 h-80">
          <Link
            to={`/posts/${post.$id}`}
            className="grid-post_link border-[#5b5b5b]"
          >
            <img
              src={post.imageUrl}
              alt="post"
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img
                  src={
                    post.creator.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <p className="line-clamp-1">{post.creator.name}</p>
              </div>
            )}
            {showStats && <PostStats post={post} userId={user.id} />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;
