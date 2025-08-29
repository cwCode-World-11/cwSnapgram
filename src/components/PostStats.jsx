import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useLikePost, useSavePost } from "../lib/tanstackQuery/queries";
import toast from "react-hot-toast";
import { LIKES, SAVES } from "../lib/constants";
import Loader from "./Loader";
import { checkIsLiked, checkIsSaved } from "../lib/utils";

const PostStats = ({ post, userId }) => {
  const { mutateAsync: likePost, isPending: isLikeLoading } = useLikePost();
  const { mutateAsync: savePost, isPending: isSaveLoading } = useSavePost();
  const [likes, setlikes] = useState(post?.liked);

  const location = useLocation();
  const isSaved = checkIsSaved(post?.saved, userId);

  useEffect(() => {
    setlikes(post?.liked);
  }, [post, isLikeLoading]);

  const handleLikePost = async (e) => {
    e.preventDefault();
    let action;
    try {
      // NOTE: toggle
      if (checkIsLiked(likes, userId)) {
        action = LIKES.unLikePost;
        await likePost({ postId: post?.imageId, userId, action });
      } else {
        action = LIKES.likePost;
        await likePost({ postId: post?.imageId, userId, action });
      }
    } catch (error) {
      console.error("error:", error);
      toast.error("Failed to like this post");
    }
  };

  const handleSavePost = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    let action;
    try {
      // NOTE: toggle
      if (checkIsLiked(post?.saved, userId)) {
        action = SAVES.unSavePost;
        await savePost({ postId: post?.imageId, userId, action });
      } else {
        action = SAVES.savePost;
        await savePost({ postId: post?.imageId, userId, action });
      }
    } catch (error) {
      console.error("error:", error);
      toast.error("Failed to SAVED post");
    }
  };

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}
    >
      {isLikeLoading ? (
        <Loader />
      ) : (
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
          <p className="small-medium lg:base-medium">{likes?.length}</p>
        </div>
      )}

      <div className="flex gap-2">
        {isSaveLoading ? (
          <Loader />
        ) : (
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="share"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={(e) => handleSavePost(e)}
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;

// NOTE: sample post
// {
//     "tags": [
//         "Tomcruise",
//         "illustration",
//         "art"
//     ],
//     "imageId": "9f87a99e-a849-4860-a55c-81856a860080",
//     "imageUrl": "https://<myProjectId>.supabase.co/storage/v1/object/public/media/fileName.png",
//     "location": "USA",
//     "caption": "Illustration art",
//     "creator": {
//         "bio": null,
//         "name": "bbb",
//         "email": "bbb@gmail.com",
//         "imageId": null,
//         "imageUrl": "https://ui-avatars.com/api/?name=BBB&size=256&bold=true&length=1",
//         "username": "bbb123",
//         "accountId": "c9201c7f-b6d3-4135-aeb5-dc5c18497182"
//     },
//     "createdAt": "1754580171024",
//     "updatedAt": "1754580171024",
//     "liked": [
//         {
//             "user": {
//                 "bio": null,
//                 "name": "bbb",
//                 "email": "bbb@gmail.com",
//                 "imageId": null,
//                 "imageUrl": "https://ui-avatars.com/api/?name=BBB&size=256&bold=true&length=1",
//                 "username": "bbb123",
//                 "accountId": "c9201c7f-b6d3-4135-aeb5-dc5c18497182"
//             }
//         }
//     ]
// }
