import Loader from "../../components/Loader";
import PostCard from "../../components/PostCard";
import UserCard from "../../components/UserCard";
import { dummyPosts as posts } from "../../lib/constants";
import { dummyUsers as creators } from "../../lib/constants";

const Home = () => {
  let isPostLoading = false,
    isUserLoading = false;

  return (
    <div className="flex flex-1">
      <div className="home-container custom-scrollbar">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {posts?.map((post) => (
                <li key={post?.$id} className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="home-creators hidden custom-scrollbar">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.map((creator) => (
              <li key={creator?.$id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
