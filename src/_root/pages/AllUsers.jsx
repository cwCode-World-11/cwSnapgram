import UserCard from "../../components/UserCard";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";
import { useGetUsers, useGetSearchUser } from "../../lib/tanstackQuery/queries";
import { Input } from "../../components/ui/input";
import { useEffect, useState } from "react";

const AllUsers = () => {
  const { user } = useAuth();
  const { isPending: isLoading, data } = useGetUsers(user?.accountId);
  const { mutateAsync: getSearchUser, isPending: isSearchLoading } =
    useGetSearchUser();
  const [searchedResult, setSearchedResult] = useState();

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const fetchSearchUser = async () => {
      if (searchValue.length > 0) {
        const f = await getSearchUser({
          userId: user?.accountId,
          searchTerm: searchValue,
        });
        setSearchedResult(f);
      }
    };

    fetchSearchUser();
  }, [searchValue]);

  return (
    <div className="common-container custom-scrollbar">
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
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <div className="user-container">
        {!searchValue && (
          <>
            <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
            {isLoading && !data?.data?.length > 0 ? (
              <Loader />
            ) : (
              <ul className="user-grid">
                {data.data?.map((creator) => {
                  return (
                    !data.currentUserFollowing.find(
                      (u) => u.followsId === creator?.accountId
                    ) && (
                      <li key={creator?.accountId}>
                        <UserCard user={creator} />
                      </li>
                    )
                  );
                })}
              </ul>
            )}
          </>
        )}
        {searchValue && (
          <>
            <h2 className="h3-bold md:h2-bold text-left w-full">
              Search result
            </h2>
            {isSearchLoading ? (
              <Loader />
            ) : searchedResult?.data?.length > 0 ? (
              <ul className="user-grid">
                {searchedResult?.data?.map((creator) => {
                  return searchedResult.following.includes(
                    creator?.accountId
                  ) ? (
                    <li key={creator?.accountId}>
                      <UserCard user={creator} isFollowing={true} />
                    </li>
                  ) : (
                    <li key={creator?.accountId}>
                      <UserCard user={creator} isFollowing={false} />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>No user found!!!</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
