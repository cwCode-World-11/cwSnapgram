import UserCard from "../../components/UserCard";
import Loader from "../../components/Loader";
import { dummyUsers as creators } from "../../lib/constants";

const AllUsers = () => {
  const isLoading = false;

  return (
    <div className="common-container custom-scrollbar">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {isLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {creators?.map((creator) => (
              <li key={creator?.$id} className="flex-1 min-w-[200px] w-full  ">
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
