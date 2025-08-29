import { Input } from "../../components/ui/input";
import Loader from "../../components/Loader";
import GridPostList from "../../components/GridPostList";
import { useGetPosts, useSearchPosts } from "../../lib/tanstackQuery/queries";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const SearchResults = ({ isSearchFetching, searchedPosts }) => {
  if (isSearchFetching) {
    return <Loader />;
  } else if (searchedPosts && searchedPosts.length > 0) {
    return <GridPostList posts={searchedPosts} />;
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">No results found</p>
    );
  }
};

const Explore = () => {
  const { ref, inView } = useInView();
  const [searchValue, setSearchValue] = useState("");
  const {
    data,
    isPending: isPostLoading,
    isError: isErrorPosts,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetPosts();
  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  const { data: searchedPosts, isPending: isSearchFetching } =
    useSearchPosts(searchValue);

  const shouldShowSearchResults = searchValue !== "",
    shouldShowPosts = !shouldShowSearchResults && posts?.length === 0;

  // if (!searchValue&&!searchedPosts)
  //   return (
  //     <div className="flex-center w-full h-full">
  //       <Loader />
  //     </div>
  //   );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isErrorPosts) {
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
  if (!posts) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="explore-container custom-scrollbar">
      <div className="explore-inner_container ">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-[#1f1f22]">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
            value={searchValue}
            onChange={(e) => {
              const { value } = e.target;
              setSearchValue(value);
            }}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>

        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            width={20}
            height={20}
            alt="filter"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
          />
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full ">End of posts</p>
        ) : (
          // posts?.map((item, index) => (
          //   <GridPostList key={`page-${index}`} posts={item} />
          // ))
          <GridPostList posts={posts} />
        )}
        {posts.length > 0 && !hasNextPage && (
          <div className="w-full flex-center py-4 text-[#a2a2a2]">
            End of your scrolling — let’s get back to your work 😏
          </div>
        )}
      </div>

      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          {isFetchingNextPage && <Loader />}
        </div>
      )}
    </div>
  );
};

export default Explore;
