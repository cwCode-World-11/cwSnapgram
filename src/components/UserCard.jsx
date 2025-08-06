import { Link } from "react-router";

import { Button } from "./ui/button";

const UserCard = ({ user }) => {
  return (
    <Link to={`/profile/${user.$id}`} className="user-card border-[#2b2b2b]">
      <img
        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14 object-cover"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>

      <Button
        type="button"
        size="sm"
        className="bg-[#877eff] hover:bg-[#877eff] text-[#fff] flex gap-2 px-5"
      >
        Follow
      </Button>
    </Link>
  );
};

export default UserCard;
