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

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts,
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.data.length === 0) {
        return null;
      }

      const lastId = lastPage.data[lastPage.data.length - 1].imageId;
      return lastId;
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
    refetchOnMount: "always",
    staleTime: 0, // so it's always considered stale
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
