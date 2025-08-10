import Loader from "../../components/Loader";
import PostCard from "../../components/PostCard";
import UserCard from "../../components/UserCard";
import { useGetPosts, useGetUsers } from "../../lib/tanstackQuery/queries";
import { useAuth } from "../../context/AuthContext";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

const Home = () => {
  const { ref, inView } = useInView();
  const { user } = useAuth();
  // const [pageParam, setPageParam] = useState(0);
  const {
    data,
    isPending: isPostLoading,
    isError: isErrorPosts,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetPosts();
  const d = useGetUsers(user?.accountId);
  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isErrorPosts || d?.data?.success === false) {
    return (
      <div className="flex flex-1 custom-scrollbar">
        <div className="home-container custom-scrollbar">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators custom-scrollbar">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="home-container custom-scrollbar">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading ? (
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
              {hasNextPage && (
                <div ref={ref} className="w-full flex-center">
                  {isFetchingNextPage && <Loader />}
                </div>
              )}
              {posts.length > 0 && !hasNextPage && (
                <div className="w-full flex-center py-4 text-[#a2a2a2]">
                  End of your scrolling — let’s get back to your work 😏
                </div>
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
