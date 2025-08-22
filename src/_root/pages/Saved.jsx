import Loader from "../../components/Loader";
import GridPostList from "../../components/GridPostList";
import { dummyPosts as savePosts } from "../../lib/constants";
import { useGetLikedOrSavedPost } from "../../lib/tanstackQuery/queries";
import { useAuth } from "../../context/AuthContext";

const Saved = () => {
  const { user: currentUser } = useAuth();
  const { data: savePosts, isPending } = useGetLikedOrSavedPost(
    currentUser?.accountId,
    "saved"
  );

  if (isPending || !currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  return (
    <div className="saved-container custom-scrollbar overflow-x-auto">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {!currentUser ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {savePosts.length === 0 ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <GridPostList posts={savePosts} showStats={false} />
          )}
        </ul>
      )}
    </div>
  );
};

export default Saved;
