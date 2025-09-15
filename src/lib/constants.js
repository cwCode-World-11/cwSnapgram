export const sidebarLinks = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/icons/wallpaper.svg",
    route: "/explore",
    label: "Explore",
  },
  {
    imgURL: "/assets/icons/people.svg",
    route: "/all-users",
    label: "People",
  },
  {
    imgURL: "/assets/icons/bookmark.svg",
    route: "/saved",
    label: "Saved",
  },
  {
    imgURL: "/assets/icons/gallery-add.svg",
    route: "/create-post",
    label: "Create Post",
  },
];

export const bottombarLinks = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/icons/wallpaper.svg",
    route: "/explore",
    label: "Explore",
  },
  {
    imgURL: "/assets/icons/bookmark.svg",
    route: "/saved",
    label: "Saved",
  },
  {
    imgURL: "/assets/icons/gallery-add.svg",
    route: "/create-post",
    label: "Create",
  },
];

export const QUERY_KEYS = {
  // AUTH KEYS
  CREATE_USER_ACCOUNT: "createUserAccount",

  // USER KEYS
  GET_CURRENT_USER: "getCurrentUser",
  GET_USERS: "getUsers",
  GET_USER_BY_ID: "getUserById",

  // POST KEYS
  GET_POSTS: "getPosts",
  GET_INFINITE_POSTS: "getInfinitePosts",
  GET_RECENT_POSTS: "getRecentPosts",
  GET_POST_BY_ID: "getPostById",
  GET_USER_POSTS: "getUserPosts",
  GET_FILE_PREVIEW: "getFilePreview",

  //  SEARCH KEYS
  SEARCH_POSTS: "getSearchPosts",

  // Follows
  getFollowers: "getFollowers",
  getFollowing: "getFollowing",
};

export const tableNames = {
  users: "users",
  posts: "posts",
  likes: "likes",
  saves: "saves",
  follows: "follows",
  comments: "comments",
};

export const PAGE_SIZE = 5;

export const SUPABASE_QUERY = {
  users: {
    getAllColumn: "*",
    getPosts: "posts:posts!posts_creator_fkey(*)",
    getFollowing:
      "following:follows!follows_userId_fkey(user:follows_followsId_fkey(*))",
    getFollowers:
      "followers:follows!follows_followsId_fkey(user:follows_userId_fkey(*))",
  },
  posts: {
    getAllColumn: "*",
    getLiked: "liked:likes!likes_postId_fkey(user:users!likes_userId_fkey(*))",
    getUsers: "creator:users!posts_creator_fkey(*)",
    getSaved: "saved:saves!saves_postId_fkey(user:users!saves_userId_fkey(*))",
    getComments: "comments:comments!comments_postId_fkey(*)",
  },
};

export const LIKES = {
  likePost: "like",
  unLikePost: "unLike",
};
export const SAVES = {
  savePost: "save",
  unSavePost: "unSave",
};
export const FOLLOWS = {
  follow: "follow",
  notFollowing: "notFollowing",
};
export const COMMENTS = {
  edit: "editing",
  comment: "commenting",
  deleteComment: "deleting",
};
