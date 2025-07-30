import Loader from "../../components/Loader";
import GridPostList from "../../components/GridPostList";
import { dummyPosts as posts } from "../../lib/constants";
import { dummyUsers as creators } from "../../lib/constants";

const LikedPosts = () => {
  const currentUser = creators[0];
  currentUser.liked = posts;

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <>
      {currentUser.liked.length === 0 && (
        <p className="text-light-4">No liked posts</p>
      )}

      <GridPostList posts={currentUser.liked} showStats={false} />
    </>
  );
};

export default LikedPosts;
