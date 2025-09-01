import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createPost,
  getCurrentUser,
  saveUserToDB,
  getInfinitePosts,
  getUsers,
  getPostById,
  updatePost,
  getUserPosts,
  deletePost,
  likePost,
  savePost,
  getUserById,
  followUser,
  getLikedOrSavedPost,
  updateUser,
  searchPosts,
  getFollowingAndFollowers,
  getSearchUser,
} from "../../supabase/database";
import { QUERY_KEYS } from "../constants";

// Post Method
export const useSaveUserToDB = () => {
  const queryCilent = useQueryClient();
  return useMutation({
    mutationFn: (user) => saveUserToDB(user),
    onSuccess: () => {
      queryCilent.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USERS],
      });
      queryCilent.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useCreatePost = () => {
  const queryCilent = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, post }) => createPost(userId, post),
    onSuccess: () => {
      queryCilent.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useUpdatePost = () => {
  const queryCilent = useQueryClient();
  return useMutation({
    mutationFn: (post) => updatePost(post),
    onSuccess: (data) => {
      queryCilent.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.data],
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ imageId, imgUrl }) => deletePost(imageId, imgUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, userId, action }) =>
      likePost(postId, userId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID],
      });
    },
  });
};
export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, userId, action }) =>
      savePost(postId, userId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID],
      });
    },
  });
};
export const useFollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ followsId, userId, action }) =>
      followUser(followsId, userId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID],
      });
    },
  });
};
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userObj) => updateUser(userObj),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.accountId],
      });
    },
  });
};

// Get Method
export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};

// NOTE: JSM INFINITE QUERY
// export const useGetPosts = () => {
//   return useInfiniteQuery({
//     queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
//     queryFn: getInfinitePosts,
//     getNextPageParam: (lastPage) => {
//       // If there's no data, there are no more pages.
//       if (lastPage && lastPage.data.length === 0) {
//         return null;
//       }
//       console.log("lastPage:", lastPage);
//       // Use the $id of the last document as the cursor.
//       const lastId = lastPage.data[lastPage.data.length - 1].imageId;
//       return lastId;
//     },
//   });
// };

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS, QUERY_KEYS.GET_POSTS],
    queryFn: ({ pageParam = 0 }) => getInfinitePosts(pageParam),
    getNextPageParam: (lastPage, pages) => {
      // If there's no data, there are no more pages.
      if (lastPage && lastPage.data.length === 0) {
        return undefined;
      }
      // NOTE: on database {sucess:true,data:arrayOfRows} take advantage of this.
      // NOTE: pages=[{sucess:true,data:arrayOfRows}] // data=[{},{},{}]
      // NOTE: here pages.length=1
      // NOTE: getNextPageParam of return value must be next page number
      // [pages.length] //return 1
      // [pages.length,pages.length] //return 2, index 0 is previous pages
      // [pages.length,pages.length,pages.length] // return 3 , index 0and 1 is previous pages
      // NOTE: when there is no last page, it returns empty array. so check if condition.
      return pages.length;
    },
  });
};

export const useGetUsers = (userId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS, userId],
    queryFn: () => getUsers(userId),
  });
};

export const useGetPostById = (postId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
    refetchOnMount: "always",
    staleTime: 0,
  });
};

export const useGetUserPosts = (userId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
  });
};
export const useGetUserById = (userId) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.GET_USER_BY_ID,
      userId,
      QUERY_KEYS.GET_USERS,
      QUERY_KEYS.GET_CURRENT_USER,
    ],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};
export const useGetLikedOrSavedPost = (userId, ennaVennumUnnakku) => {
  return useQuery({
    queryKey: [userId, ennaVennumUnnakku],
    queryFn: () => getLikedOrSavedPost(userId, ennaVennumUnnakku),
    enabled: !!userId,
  });
};

export const useSearchPosts = (searchTerm) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm,
  });
};

export const useGetFollowingAndFollowers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId }) => getFollowingAndFollowers(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getFollowers],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getFollowing],
      });
    },
  });
};
export const useGetSearchUser = () => {
  return useMutation({
    mutationFn: ({ userId, searchTerm }) => getSearchUser(userId, searchTerm),
  });
};
