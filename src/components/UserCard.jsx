import { Link } from "react-router";
import { Button } from "./ui/button";
import { useFollowUser } from "../lib/tanstackQuery/queries";
import Loader from "./Loader";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { FOLLOWS } from "../lib/constants";

const UserCard = ({ user, isFollowing = false }) => {
  const { user: currentUser } = useAuth();
  const { mutateAsync: followUser, isPending: isFollowingLoading } =
    useFollowUser();
  const [hasFollowed, setHasFollowed] = useState(isFollowing);

  // useEffect(() => {}, [isFollowingLoading]);

  const handleFollow = async () => {
    let action;
    try {
      if (hasFollowed) {
        // NOTE: unfollow user.
        action = FOLLOWS.follow;
        const s = await followUser({
          followsId: user.accountId,
          userId: currentUser.accountId,
          action,
        });
        if (s.success) {
          setHasFollowed(false);
          toast("Unfollowing " + user.name);
        }
      } else {
        action = FOLLOWS.notFollowing;
        const s = await followUser({
          followsId: user?.accountId,
          userId: currentUser?.accountId,
          action,
        });
        if (s.success) {
          setHasFollowed(true);
          toast("Following " + user.name);
        }
      }
    } catch (error) {
      console.error("error:", error);
      toast.error("Failled to follow the user");
    }
  };

  const btnStyle = !hasFollowed
    ? "bg-[#877eff] hover:bg-[#202020] text-[#fff] flex gap-2 px-5"
    : "bg-[#202020] hover:bg-[#877eff] text-[#fff] flex gap-2 px-5";

  return (
    <div className="user-card border-[#2b2b2b]">
      <Link to={`/profile/${user.accountId}`} className="flex-center flex-col">
        <img
          src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="creator"
          className="rounded-full w-14 h-14 object-cover"
        />

        <div className="flex-center flex-col gap-1 py-1">
          <p className="base-medium text-light-1 text-center line-clamp-1">
            {user.name}
          </p>
          <p className="small-regular text-light-3 text-center line-clamp-1">
            @{user.username}
          </p>
        </div>
      </Link>

      <Button
        type="button"
        size="sm"
        className={btnStyle}
        onClick={handleFollow}
      >
        {isFollowingLoading ? <Loader /> : hasFollowed ? "Following" : "Follow"}
      </Button>
    </div>
  );
};

export default UserCard;
