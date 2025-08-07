import { useParams, Link, useNavigate } from "react-router";
import { multiFormatDateString } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import Loader from "../../components/Loader";
import GridPostList from "../../components/GridPostList";
import PostStats from "../../components/PostStats";
import {
  useDeletePost,
  useGetPostById,
  useGetUserPosts,
} from "../../lib/tanstackQuery/queries";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { data: postArr, isPending: isLoading } = useGetPostById(id);
  const { data: userPosts, isPending: isUserPostLoading } = useGetUserPosts(
    user?.accountId
  );
  const { mutateAsync: deletePost, isPending: isDeletePostLoading } =
    useDeletePost();
  const relatedPosts = useMemo(() => {
    if (!userPosts || !postArr?.[0]) return [];
    return userPosts.filter((p) => p?.imageId !== postArr[0]?.imageId);
  }, [userPosts, postArr]);

  const handleDeletePost = async () => {
    try {
      await deletePost({ imageId: postArr?.[0].imageId });
      if (isDeletePostLoading) toast("Deleting...");
    } catch (error) {
      console.error("error:", error);
      toast.error("Error while deleting");
    } finally {
      toast.success("Post was deleted!!");
      navigate(-1);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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

      {isLoading || !postArr?.[0] ? (
        <Loader />
      ) : (
        <div className="post_details-card border-[#232323]">
          <img
            src={postArr?.[0]?.imageUrl}
            alt="creator"
            className="post_details-img"
          />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${postArr?.[0]?.creator.accountId}`}
                className="flex items-center gap-3"
              >
                <img
                  src={
                    postArr?.[0]?.creator?.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full object-cover"
                />
                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {postArr?.[0]?.creator.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {multiFormatDateString(postArr?.[0]?.createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {postArr?.[0]?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  to={`/update-post/${postArr?.[0]?.imageId}`}
                  className={`${
                    user?.accountId !== postArr?.[0]?.creator.accountId &&
                    "hidden"
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
                    user?.accountId !== postArr?.[0]?.creator?.accountId &&
                    "hidden"
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
              <p>{postArr?.[0]?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {postArr?.[0]?.tags.map((tag, index) => (
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
              <PostStats post={postArr?.[0]} userId={user?.accountId} />
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
