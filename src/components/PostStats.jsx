import { useState } from "react";
import { useLocation } from "react-router";
import { checkIsLiked } from "@/lib/utils";

const PostStats = ({ post, userId }) => {
  const location = useLocation();
  //   const likes = ["123", "321", "1111", "222", "333"];
  const likesList = post.likes.map((user) => user.$id);

  const [likes, setLikes] = useState(likesList);
  const isSaved = true;

  const handleLikePost = (e) => {
    e.stopPropagation();
  };

  const handleSavePost = (e) => {
    e.stopPropagation();
  };

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}
    >
      <div className="flex gap-2 mr-5">
        <img
          src={`${
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={(e) => handleLikePost(e)}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="share"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={(e) => handleSavePost(e)}
        />
      </div>
    </div>
  );
};

export default PostStats;
