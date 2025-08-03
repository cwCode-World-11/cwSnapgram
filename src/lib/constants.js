import imageUrl1 from "/assets/profile1.jpg";
import imageUrl2 from "/assets/profile2.png";
import imageUrl3 from "/assets/profile3.jpg";
import post1 from "/assets/post1.jpg";
import post2 from "/assets/post2.jpg";
import post3 from "/assets/post3.jpg";
import post4 from "/assets/post4.jpeg";
import post5 from "/assets/post5.jpg";
import post6 from "/assets/post6.jpg";
import post7 from "/assets/post7.jpg";
import post8 from "/assets/post8.png";

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
};

export const tableNames = {
  users: "users",
  posts: "posts",
  saves: "saves",
};

/////////////DUMMY////////////////////////////////////
export const dummyPosts = [
  {
    $id: "postID121212",
    creator: {
      $id: "123",
      $createdAt: "1753767902172",
      imageUrl: imageUrl1,
      name: "Hello World",
      location: "USA",
    },
    caption: "Hello World by StarkAva",
    tags: ["Vite", "Github", "React"],
    imageUrl: post1,
    likes: [
      { $id: "1233", name: "aaa" },
      { $id: "321", name: "bbb" },
      { $id: "1221", name: "ccc" },
      { $id: "333", name: "ddd" },
      { $id: "5qr1", name: "eee" },
    ], ///////////////////////////maybe mutiple userObj
  },
  {
    $id: "postID35343",
    creator: {
      $id: "321",
      $createdAt: "1753767902172",
      imageUrl: imageUrl2,
      name: "Hi",
      location: "UK",
    },
    caption: "Hi this is caption",
    tags: ["Gal", "Kate", "Charlize"],
    imageUrl: post2,
    likes: [
      { $id: "123", name: "aaa" },
      { $id: "321", name: "bbb" },
      { $id: "1221", name: "ccc" },
      { $id: "333", name: "ddd" },
      { $id: "5qr1", name: "eee" },
    ], ///////////////////////////maybe mutiple userObj
  },
  {
    $id: "postID37497938",
    creator: {
      $id: "111",
      $createdAt: "1753767902172",
      imageUrl: imageUrl3,
      name: "AAA",
      location: "Dubai",
    },
    caption: "Dubai thuthukudi pakathula irukku",
    tags: ["Hello", "World", "Dubai"],
    imageUrl: post3,
    likes: [
      { $id: "123", name: "aaa" },
      { $id: "321", name: "bbb" },
      { $id: "1221", name: "ccc" },
      { $id: "333", name: "ddd" },
      { $id: "5qr1", name: "eee" },
    ], ///////////////////////////maybe mutiple userObj
  },
  {
    $id: "postID346",
    creator: {
      $id: "222",
      $createdAt: "1753767902172",
      imageUrl: imageUrl1,
      name: "BBB",
      location: "USA",
    },
    caption: "Hello World by StarkAva",
    tags: ["Vite", "Github", "React"],
    imageUrl: post4,
    likes: [
      { $id: "123", name: "aaa" },
      { $id: "321", name: "bbb" },
      { $id: "1221", name: "ccc" },
      { $id: "333", name: "ddd" },
      { $id: "5qr1", name: "eee" },
    ], ///////////////////////////maybe mutiple userObj
  },
  {
    $id: "postID5645",
    creator: {
      $id: "333",
      $createdAt: "1753767902172",
      imageUrl: imageUrl3,
      name: "CCC",
      location: "USA",
    },
    caption: "Hello World by StarkAva",
    tags: ["CCC", "Pattern", "Random"],
    imageUrl: post5,
    likes: [
      { $id: "123", name: "aaa" },
      { $id: "321", name: "bbb" },
      { $id: "1221", name: "ccc" },
      { $id: "333", name: "ddd" },
      { $id: "5qr1", name: "eee" },
    ], ///////////////////////////maybe mutiple userObj
  },
];

export const dummyUsers = [
  {
    $id: "123",
    imageUrl: imageUrl1,
    name: "Hello World",
    username: "helloworld",
  },
  {
    $id: "321",
    imageUrl: post8,
    name: "Hi",
    username: "hi",
  },
  {
    $id: "111",
    imageUrl: post7,
    name: "Stark",
    username: "stark",
  },
  {
    $id: "222",
    imageUrl: post6,
    name: "Ava",
    username: "ava",
  },
  {
    $id: "333",
    imageUrl: post5,
    name: "StarkAva",
    username: "starkava",
  },
  {
    $id: "555",
    imageUrl: post5,
    name: "StarkAva",
    username: "starkava",
  },
  {
    $id: "666",
    imageUrl: post5,
    name: "StarkAva",
    username: "starkava",
  },
  {
    $id: "444",
    imageUrl: post5,
    name: "StarkAva",
    username: "starkava",
  },
  {
    $id: "777",
    imageUrl: post5,
    name: "StarkAva",
    username: "starkava",
  },
  {
    $id: "888",
    imageUrl: post5,
    name: "StarkAva",
    username: "starkava",
  },
  {
    $id: "999",
    imageUrl: post5,
    name: "StarkAva",
    username: "starkava",
  },
  {
    $id: "235",
    imageUrl: post5,
    name: "StarkAva",
    username: "starkava",
  },
  {
    $id: "8465",
    imageUrl: post5,
    name: "StarkAva",
    username: "starkava",
  },
  {
    $id: "897",
    imageUrl: post5,
    name: "StarkAva",
    username: "starkava",
  },
];
