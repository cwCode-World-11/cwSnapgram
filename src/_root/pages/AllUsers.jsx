import UserCard from "../../components/UserCard";
import Loader from "../../components/Loader";
import { dummyUsers as creators } from "../../lib/constants";
import { useAuth } from "../../context/AuthContext";
import { useGetUsers } from "../../lib/tanstackQuery/queries";

const AllUsers = () => {
  const { user } = useAuth();
  const { isPending: isLoading, data } = useGetUsers(user?.accountId);

  return (
    <div className="common-container custom-scrollbar">
      <div className="user-container">
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
      </div>
    </div>
  );
};

export default AllUsers;
