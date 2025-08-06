import { useParams, Link, useNavigate } from "react-router";
import { multiFormatDateString } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import Loader from "../../components/Loader";
import GridPostList from "../../components/GridPostList";
import PostStats from "../../components/PostStats";
import {
  useGetPostById,
  useGetUserPosts,
} from "../../lib/tanstackQuery/queries";
import { useAuth } from "../../context/AuthContext";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { data: postArr, isPending: isLoading } = useGetPostById(id);
  let post;
  const { data: userPosts, isPending: isUserPostLoading } = useGetUserPosts(
    user?.accountId
  );
  const relatedPosts = userPosts?.filter(
    (p) => p?.imageId !== postArr[0]?.imageId
  ); //NOTE: except this post details

  const handleDeletePost = () => {
    //TODO: deletePost({ postId: id, imageId: post?.imageId });
    navigate(-1);
  };

  // if (!user || isLoading || isUserPostLoading) {
  //   return (
  //     <div className="w-screen h-screen flex items-center justify-center">
  //       <Loader />
  //     </div>
  //   );
  // }

  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // TODO: Slow post details changing , for more post only need own user posts not others posts

  if (postArr) {
    post = postArr[0];
    console.log("post:", post);
  }

  return (
    <div className="post_details-container custom-scrollbar">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost"
        >
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isLoading || !post ? (
        <Loader />
      ) : (
        <div className="post_details-card border-[#232323]">
          <img
            src={post?.imageUrl}
            alt="creator"
            className="post_details-img"
          />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${post?.creator.accountId}`}
                className="flex items-center gap-3"
              >
                <img
                  src={
                    post?.creator?.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full object-cover"
                />
                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {multiFormatDateString(post?.createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  to={`/update-post/${post?.imageId}`}
                  className={`${
                    user?.accountId !== post?.creator.accountId && "hidden"
                  }`}
                >
                  <img
                    src={"/assets/icons/edit.svg"}
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>

                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ost_details-delete_btn ${
                    user?.accountId !== post?.creator?.accountId && "hidden"
                  }`}
                >
                  <img
                    src={"/assets/icons/delete.svg"}
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>

            <hr className="border w-full border-[#1c1c1c]" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag, index) => (
                  <li
                    key={`${tag}${index}`}
                    className="text-light-3 small-regular"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full">
              <PostStats post={post} userId={user?.accountId} />
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-[#1c1c1c]" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          More Related Posts
        </h3>
        {isUserPostLoading || !relatedPosts ? (
          <Loader />
        ) : (
          <GridPostList posts={relatedPosts} />
        )}
      </div>
    </div>
  );
};

export default PostDetails;
