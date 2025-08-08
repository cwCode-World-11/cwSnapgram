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
} from "../../supabase/database";
import { QUERY_KEYS } from "../constants";

// Post Method
export const useSaveUserToDB = () => {
  return useMutation({
    mutationFn: (user) => saveUserToDB(user),
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
    mutationFn: ({ imageId }) => deletePost(imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
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
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
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
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(userId),
  });
};

export const useGetPostById = (postId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};

export const useGetUserPosts = (userId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
    refetchOnMount: "always",
    staleTime: 0, // so it's always considered stale
  });
};
