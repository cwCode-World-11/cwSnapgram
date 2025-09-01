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
import {
  useFollowUser,
  useGetUserById,
  useGetFollowingAndFollowers,
} from "../../lib/tanstackQuery/queries";
import React, { useEffect, useState } from "react";
import { FOLLOWS } from "../../lib/constants";
import toast from "react-hot-toast";
import Modal from "../../components/Modal";
import { Input } from "../../components/ui/input";

const StatBlock = ({ value, label }) => (
  <div className="flex-center gap-2 cursor-pointer">
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
  const {
    mutateAsync: followUserForModal,
    isPending: isFollowingLoadingForModal,
  } = useFollowUser();
  const { mutateAsync: getFollowingAndFollowers, isPending: isListLoading } =
    useGetFollowingAndFollowers();

  const [imageUrl, setImageUrl] = useState("");

  const { pathname } = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowersView, setIsFollowersView] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [showUserList, setShowUserList] = useState([]);

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

  useEffect(() => {
    if (getUser) {
      setImageUrl(getUser.imageUrl);
    }
  }, [getUser?.imageUrl]);

  useEffect(() => {
    const a = async () => {
      if (isModalOpen) {
        if (!searchValue) {
          if (isFollowersView) {
            const d = await getFollowingAndFollowers({
              userId: id,
            });

            setShowUserList(d);
          } else {
            const d = await getFollowingAndFollowers({
              userId: id,
            });
            setShowUserList(d);
          }
        }
      }
    };
    a();
  }, [isModalOpen, isFollowersView, id]);

  useEffect(() => {
    const a = async () => {
      if (isModalOpen) {
        if (searchValue) {
          // NOTE: so don't fetch every time from supabase. that's why i use "showUserList?.[0].type" to prevent unwanted request
          if (searchValue.length > 1) {
            return;
          }
          const d = await getFollowingAndFollowers({
            userId: id,
          });

          setShowUserList(d);
        }
      }
    };
    a();
  }, [searchValue]);

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
          toast("Unfollowing " + getUser.name);
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
          toast("Following " + getUser.name);
        }
      }
    } catch (error) {
      console.error("error:", error);
      toast.error("Failled to follow the currentUser");
    }
  };

  if (isGetUserByIdLoading) {
    return (
      <div className="flex-center w-full h-screen">
        <Loader />
      </div>
    );
  }

  if (!getUser) {
    return (
      <div className="w-full h-screen flex-center items-center justify-center flex-col">
        <p className="">
          There is no such a user <br />
        </p>
        <p className="text-blue-400">
          <Link to="/">Back to home</Link>
        </p>
      </div>
    );
  }

  return (
    <>
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        <FollowingAndFollowers
          p={{
            searchValue,
            setSearchValue,
            isFollowersView,
            setIsFollowersView,
            getFollowingAndFollowers,
            isListLoading,
            showUserList,
            followUserForModal,
            isFollowingLoadingForModal,
            currentUser,
            id,
            setIsModalOpen,
          }}
        />
      </Modal>
      <div className="profile-container custom-scrollbar">
        <div className="profile-inner_container">
          <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
            <img
              src={imageUrl || "/assets/icons/profile-placeholder.svg"}
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

              <div
                className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20"
                onClick={() => setIsModalOpen(true)}
              >
                <StatBlock value={getUser?.posts.length} label="Posts" />
                <StatBlock
                  value={getUser?.followers?.length}
                  label="Followers"
                />
                <StatBlock
                  value={getUser?.following?.length}
                  label="Following"
                />
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
                    {!isFollowingLoading &&
                      (hasFollowed ? "Unfollow" : "Follow")}
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
            element={
              getUser?.posts.length === 0 ? (
                <div className="w-full h-full flex-center justify-center">
                  <p>No post here</p>
                </div>
              ) : (
                <GridPostList posts={getUser?.posts} showUser={false} />
              )
            }
          />
          {getUser.accountId === currentUser?.accountId && (
            <Route path="/liked-posts" element={<LikedPost />} />
          )}
        </Routes>
        <Outlet />
      </div>
    </>
  );
};

// why "p"? because we don't want to use messy props
const FollowingAndFollowers = ({ p }) => {
  let showUserListFiltered = [];

  if (p?.showUserList.length > 0) {
    if (!p.searchValue) {
      showUserListFiltered = p.isFollowersView
        ? p?.showUserList.filter((list) => list.type === "followers")
        : p?.showUserList.filter((list) => list.type === "following");
    } else {
      const uniqueArr = Array.from(
        new Map(p?.showUserList.map((item) => [item.accountId, item])).values()
      );
      showUserListFiltered = uniqueArr.filter((list) => {
        if (
          list.name.includes(p.searchValue) ||
          list.username.includes(p.searchValue) ||
          list.accountId.includes(p.searchValue)
        ) {
          return list;
        }
      });
    }
  }

  if (!p?.showUserList) {
    return;
  }

  return (
    <div className="sm:w-[200px] md:w-[400px] max-h-[30rem] overflow-hidden">
      <div className="flex gap-1 px-4 w-full rounded-lg bg-[#1f1f22] mb-5">
        <img
          src="/assets/icons/search.svg"
          width={24}
          height={24}
          alt="search"
          className="object-fill"
        />
        <Input
          type="text"
          placeholder="Search"
          className="explore-search"
          value={p.searchValue}
          onChange={(e) => p.setSearchValue(e.target.value)}
        />
      </div>

      {!p.searchValue && (
        <>
          <div className="w-fit bg-[#363636] rounded-md overflow-hidden mb-5">
            <button
              className={`mr-2 p-2 cursor-pointer ${
                p.isFollowersView
                  ? "bg-[#d0d0d0] text-[#363636]"
                  : "text-[#d0d0d0] bg-[#363636]"
              }`}
              onClick={() => p.setIsFollowersView(true)}
            >
              Followers
            </button>
            <button
              className={`p-2 cursor-pointer ${
                p.isFollowersView
                  ? "text-[#d0d0d0] bg-[#363636]"
                  : "bg-[#d0d0d0] text-[#363636]"
              }`}
              onClick={() => p.setIsFollowersView(false)}
            >
              Following
            </button>
          </div>
        </>
      )}
      {p.isListLoading && (
        <div className="sm:w-[200px] md:w-[400px] flex-center max-h-[400px]">
          <Loader />
        </div>
      )}

      <div className="custom-scrollbar overflow-y-auto max-h-[20rem]">
        {/* <ListUser /> */}
        {showUserListFiltered?.length === 0 && <span>List was empty</span>}
        {showUserListFiltered?.length > 0 &&
          showUserListFiltered.map((list) => {
            return <ListUser key={list?.accountId} user={list} p={p} />;
          })}
      </div>
    </div>
  );
};

function ListUser({ user, p }) {
  const [clickedId, setClickedId] = useState("");
  const isFollowing = p?.showUserList.find((list) => {
    if (list.type === "following") {
      if (user.accountId === list.accountId) {
        return true;
      }
    }
  });

  const [localFollowing, setLocalFollowing] = useState(isFollowing);

  // const isFollowing = user.type === "following" ? true : false;
  const btn = {
    label: localFollowing ? "Following" : "Follow back",
    btnStyle: localFollowing
      ? "bg-[#313131] hover:bg-[#272727]"
      : "bg-[#877eff] hover:bg-[#6059c3]",
  };

  const linkStyle = p.currentUser.accountId !== p.id ? "w-full" : "";

  const handleFollow = async (followsId) => {
    let action;
    try {
      setClickedId(followsId);
      if (localFollowing) {
        // NOTE: unfollow user.
        action = FOLLOWS.follow;
        const s = await p.followUserForModal({
          followsId,
          userId: p.currentUser.accountId,
          action,
        });
        if (s.success) {
          setLocalFollowing(false); //NOTE:user unfollowed
          toast("Unfollowing " + user?.name);
        }
      } else {
        action = FOLLOWS.notFollowing;
        const s = await p.followUserForModal({
          followsId,
          userId: p.currentUser?.accountId,
          action,
        });
        if (s.success) {
          setLocalFollowing(true); //NOTE:user unfollowing
          toast("Following " + user?.name);
        }
      }
    } catch (error) {
      console.error("error:", error);
      toast.error("Failled to follow the currentUser");
    } finally {
      setClickedId("");
    }
  };

  return (
    <div className="flex items-center justify-between rounded-md mr-3">
      <Link
        to={`/profile/${user.accountId}`}
        // className="flex items-center justify-between p-3 rounded-md "
        className={
          "flex items-center justify-between p-3 rounded-md " + linkStyle
        }
        onClick={() => p.setIsModalOpen(false)}
      >
        <div className="flex-center">
          <div className="w-[50px] h-[50px] rounded-full overflow-hidden mr-2">
            <img src={user?.imageUrl} className="object-cover" />
          </div>
          <span>{user?.name}</span>
        </div>

        {p.currentUser.accountId !== p.id && (
          <>
            <label
              className={"py-1 px-3 rounded-md bg-[#313131] hover:bg-[#272727]"}
            >
              <span>View profile</span>
            </label>
          </>
        )}
      </Link>

      {p.currentUser.accountId === p.id && (
        <label className={"py-1 px-3 rounded-md " + btn.btnStyle}>
          {p.isFollowingLoadingForModal && user.accountId === clickedId && (
            <Loader />
          )}
          {p.isFollowingLoadingForModal && user.accountId !== clickedId && (
            <span onClick={() => handleFollow(user?.accountId)}>
              {btn.label}
            </span>
          )}
          {!p.isFollowingLoadingForModal && (
            <span onClick={() => handleFollow(user?.accountId)}>
              {btn.label}
            </span>
          )}
        </label>
      )}
    </div>
  );
}

export default Profile;
