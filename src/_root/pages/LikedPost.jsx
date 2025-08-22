import Loader from "../../components/Loader";
import GridPostList from "../../components/GridPostList";
import { dummyPosts as posts } from "../../lib/constants";
import { dummyUsers as creators } from "../../lib/constants";
import { useGetLikedOrSavedPost } from "../../lib/tanstackQuery/queries";
import { useAuth } from "../../context/AuthContext";

const LikedPosts = () => {
  const { user } = useAuth();
  const { data: likedPosts, isPending } = useGetLikedOrSavedPost(
    user?.accountId,
    "liked"
  );

  if (isPending || !user)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <>
      {likedPosts.length === 0 && (
        <p className="text-light-4">No liked posts</p>
      )}

      {likedPosts && <GridPostList posts={likedPosts} showStats={false} />}
    </>
  );
};

export default LikedPosts;
