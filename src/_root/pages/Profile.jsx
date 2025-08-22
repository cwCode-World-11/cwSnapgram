import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router";
import LikedPost from "./LikedPost";
import { Button } from "../../components/ui/button";
import Loader from "../../components/Loader";
import GridPostList from "../../components/GridPostList";
import { useAuth } from "../../context/AuthContext";
import { useFollowUser, useGetUserById } from "../../lib/tanstackQuery/queries";
import { useEffect, useState } from "react";
import { FOLLOWS } from "../../lib/constants";
import toast from "react-hot-toast";

const StatBlock = ({ value, label }) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [hasFollowed, setHasFollowed] = useState(false);
  const { data: getUser, isPending: isGetUserByIdLoading } = useGetUserById(id);
  const { mutateAsync: followUser, isPending: isFollowingLoading } =
    useFollowUser();

  const { pathname } = useLocation();
  const btnStyle = !hasFollowed
    ? "bg-[#877eff] hover:bg-[#202020] text-[#fff] flex gap-2 px-5"
    : "bg-[#202020] hover:bg-[#877eff] text-[#fff] flex gap-2 px-5";

  useEffect(() => {
    if (getUser?.followers?.length) {
      const isFollowing = getUser.followers.some(
        (u) => u.user.accountId === currentUser?.accountId
      );
      setHasFollowed(isFollowing);
    } else {
      setHasFollowed(false);
    }
  }, [getUser, currentUser?.accountId]);

  const handleFollow = async (followsId) => {
    let action;
    try {
      if (hasFollowed) {
        // NOTE: unfollow currentUser.
        action = FOLLOWS.follow;
        const s = await followUser({
          followsId,
          userId: currentUser.accountId,
          action,
        });
        if (s.success) {
          setHasFollowed(false);
          toast("Unfollowing " + currentUser.name);
        }
      } else {
        action = FOLLOWS.notFollowing;
        const s = await followUser({
          followsId,
          userId: currentUser?.accountId,
          action,
        });
        if (s.success) {
          setHasFollowed(true);
          toast("Following " + currentUser.name);
        }
      }
    } catch (error) {
      console.error("error:", error);
      toast.error("Failled to follow the currentUser");
    }
  };

  if (!getUser || isGetUserByIdLoading)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="profile-container custom-scrollbar">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={getUser.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full object-cover"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {getUser.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{getUser.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={getUser?.posts.length} label="Posts" />
              <StatBlock value={getUser?.followers?.length} label="Followers" />
              <StatBlock value={getUser?.following?.length} label="Following" />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {getUser.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <div
              className={`${
                currentUser?.accountId !== getUser.accountId && "hidden"
              }`}
            >
              <Link
                to={`/update-profile/${getUser.accountId}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  currentUser?.accountId !== getUser.accountId && "hidden"
                }`}
              >
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
            <div
              className={`${currentUser?.accountId === id && "hidden"}`}
              onClick={() => handleFollow(id)}
            >
              {
                <Button
                  type="button"
                  className={`shad-button_primary px-8 ${btnStyle}`}
                >
                  {isFollowingLoading && <Loader />}
                  {!isFollowingLoading && (hasFollowed ? "Unfollow" : "Follow")}
                </Button>
              }
            </div>
          </div>
        </div>
      </div>

      {getUser.accountId === currentUser?.accountId && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "!bg-[#232323]"
            }`}
          >
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "!bg-[#232323]"
            }`}
          >
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}

      <Routes>
        <Route
          index
          element={<GridPostList posts={getUser?.posts} showUser={false} />}
        />
        {getUser.accountId === currentUser?.accountId && (
          <Route path="/liked-posts" element={<LikedPost />} />
        )}
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;
