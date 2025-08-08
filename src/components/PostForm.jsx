import * as z from "zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import FileUploader from "./FileUploader";
import Loader from "./Loader";
import { PostValidation } from "../lib/validation";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCreatePost, useUpdatePost } from "../lib/tanstackQuery/queries";
import { useEffect } from "react";

const PostForm = ({ post, action }) => {
  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost();
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
    useUpdatePost();
  const { user } = useAuth();
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  });

  // Handler
  const handleSubmit = async (value) => {
    // ACTION = UPDATE////////////////////////
    if (post && action === "Update") {
      const updatedPost = await updatePost({
        ...value,
        imageId: post.imageId,
        imageUrl: post.imageUrl,
        userId: user.accountId,
      });
      if (!updatedPost) {
        toast(`${action} post failed. Please try again.`);
        return;
      }
      return navigate(`/posts/${updatedPost}`);
    }

    // ACTION = CREATE////////////////////////
    const newPost = await createPost({
      userId: user.accountId,
      post: { ...value },
    });
    if (!newPost) {
      toast(`${action} post failed. Please try again.`);
      return;
    }
    if (newPost.success) {
      toast.success("Post was created");
    } else {
      toast.error("Sorry!, can't post right now");
      return;
    }
    navigate("/");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea bg-[#101012] custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input bg-[#101012]"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Art, Expression, Learn"
                  type="text"
                  className="shad-input bg-[#101012]"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate}
          >
            {(isLoadingCreate || isLoadingUpdate) && (
              <>
                <Loader />
                <span>Loading...</span>
              </>
            )}
            {isLoadingCreate || isLoadingUpdate || action + " Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
