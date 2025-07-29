import * as z from "zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
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

const PostValidation = z.object({
  caption: z
    .string()
    .min(5, { message: "Minimum 5 characters." })
    .max(2200, { message: "Maximum 2,200 caracters" }),
  file: z.custom(),
  location: z
    .string()
    .min(1, { message: "This field is required" })
    .max(1000, { message: "Maximum 1000 characters." }),
  tags: z.string(),
});

const PostForm = ({ post, action }) => {
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
    // ACTION = UPDATE
    // if (post && action === "Update") {
    //   const updatedPost = await updatePost({
    //     ...value,
    //     postId: post.$id,
    //     imageId: post.imageId,
    //     imageUrl: post.imageUrl,
    //   });
    //   if (!updatedPost) {
    //     toast({
    //       title: `${action} post failed. Please try again.`,
    //     });
    //   }
    //   return navigate(`/posts/${post.$id}`);
    // }
    // // ACTION = CREATE
    // const newPost = await createPost({
    //   ...value,
    //   userId: user.id,
    // });
    // if (!newPost) {
    //   toast({
    //     title: `${action} post failed. Please try again.`,
    //   });
    // }
    // navigate("/");
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
            //    TODO: disabled={isLoadingCreate || isLoadingUpdate}
            //   >
            //     {(isLoadingCreate || isLoadingUpdate) && <Loader />}
            //     {action} Post
            //     disabled={isLoadingCreate || isLoadingUpdate}
          >
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
