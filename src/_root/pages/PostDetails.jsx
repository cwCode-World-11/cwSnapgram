import { useParams, Link, useNavigate } from "react-router";
import { formatInstagramTime } from "../../lib/utils";
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
  const { data: userPosts, isPending: isUserPostLoading } = useGetUserPosts(
    user?.accountId
  );
  const { data: postArr, isPending: isLoading } = useGetPostById(id);
  const { mutateAsync: deletePost, isPending: isDeletePostLoading } =
    useDeletePost();
  const relatedPosts = useMemo(() => {
    if (!userPosts || !postArr?.[0]) return [];
    return userPosts.filter((p) => p?.imageId !== postArr[0]?.imageId);
  }, [userPosts, postArr]);

  const handleDeletePost = async () => {
    try {
      const postDeleted = await deletePost({
        imageId: postArr?.[0].imageId,
        imgUrl: postArr?.[0]?.imageUrl,
      });
      if (isDeletePostLoading) toast("Deleting...");
      if (postDeleted) {
        toast.success("Post was deleted!!");
      }
    } catch (error) {
      console.error("error:", error);
      toast.error("Error while deleting");
    } finally {
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

      {isLoading ? (
        <Loader />
      ) : !postArr?.[0] ? (
        <>
          <div>User may edited or deleted this post</div>
        </>
      ) : (
        <div className="post_details-card border-[#232323]">
          <img
            src={postArr?.[0]?.imageUrl || "/assets/icons/people.svg"}
            alt="creator"
            className="post_details-img"
          />

          <div className="post_details-info">
            <div className="flex-between w-full gap-1">
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
                    <p className="subtle-semibold break-words lg:small-regular">
                      {formatInstagramTime(postArr?.[0]?.createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {postArr?.[0]?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center sm:gap-1">
                <Button
                  className={`${
                    user?.accountId !== postArr?.[0]?.creator.accountId &&
                    "hidden"
                  } bg-[#09090a17]`}
                  onClick={() =>
                    navigate(`/update-post/${postArr?.[0]?.imageId}`)
                  }
                >
                  <img
                    src={"/assets/icons/edit.svg"}
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Button>

                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ost_details-delete_btn ${
                    user?.accountId !== postArr?.[0]?.creator?.accountId &&
                    "hidden"
                  } -mx-5`}
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
              <p className="break-words whitespace-normal">
                {postArr?.[0]?.caption}
              </p>
              <ul className="flex flex-wrap gap-1 mt-2">
                {postArr?.[0]?.tags.map((tag, index) => (
                  <li
                    key={`${tag}${index}`}
                    className="text-light-3 small-regular break-words whitespace-normal"
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
          <GridPostList posts={relatedPosts.slice(0, 10)} />
        )}
      </div>
    </div>
  );
};

export default PostDetails;
