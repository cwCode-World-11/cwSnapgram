import Loader from "../../components/Loader";
import PostCard from "../../components/PostCard";
import UserCard from "../../components/UserCard";
import { useGetPosts, useGetUsers } from "../../lib/tanstackQuery/queries";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const { data, isPending: isPostLoading } = useGetPosts();
  const d = useGetUsers(user?.accountId);
  const posts = data?.pages[0]?.data;

  // TODO: infinite scroll is not working

  return (
    <div className="flex flex-1">
      <div className="home-container custom-scrollbar">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {posts?.length > 0 ? (
                posts?.map((post) => (
                  <li
                    key={post?.imageId}
                    className="flex justify-center w-full"
                  >
                    <PostCard post={post} />
                  </li>
                ))
              ) : (
                <p>No media here</p>
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="home-creators hidden custom-scrollbar">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {d.isPending && <Loader />}
        {!d.isPending && d?.data?.data.length > 0 ? (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {d.data.data?.map((creator) => (
              <li key={creator?.accountId}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        ) : (
          <p>No creators right for now</p>
        )}
      </div>
    </div>
  );
};

export default Home;
