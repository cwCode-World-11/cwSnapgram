import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-hot-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Loader from "../../components/Loader";
import ProfileUploader from "../../components/ProfileUploader";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { useAuth } from "../../context/AuthContext";
import { ProfileValidation } from "../../lib/validation";
import { useUpdateUser } from "../../lib/tanstackQuery/queries";
import Modal from "../../components/Modal";
import { useEffect, useState } from "react";

const UpdateProfile = () => {
  const { id } = useParams();
  const { user, setUser, setCurrentUser, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const { mutateAsync: updateUser, isPending: isLoadingUpdate } =
    useUpdateUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const session = JSON.parse(
    localStorage.getItem(
      `sb-${import.meta.env.VITE_SUPABASE_PROJECT_ID}-auth-token`
    )
  );
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name: user?.name,
      username: user?.username,
      email: user?.email,
      bio: user?.bio || "",
    },
  });

  // Queries
  const currentUser = user;

  useEffect(() => {
    if (!isAuthLoading && !session) {
      toast("No session found!!!. navigating to login.");
      navigate("/login");
      return;
    }
  }, [session, isAuthLoading]);

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  // Handler Update
  const handleUpdate = async (value) => {
    const updatedUser = await updateUser({
      accountId: user.accountId,
      imageUrl: user.imageUrl,
      ...value,
    });

    if (!updatedUser) {
      toast.error(`Update user failed. Please try again.`);
      return;
    }

    setUser(updatedUser);
    return navigate(`/profile/${id}`);
  };

  const handleDeleteAccountAndPosts = async () => {
    try {
      setIsDeleteLoading(true);
      const loadingID = toast.loading(
        "Deleting your account and all of your post..."
      );
      // NOTE: this is edge function i coded on supabase edge function editor tab
      const res = await fetch(
        `https://${
          import.meta.env.VITE_SUPABASE_PROJECT_ID
        }.supabase.co/functions/v1/Delete-User`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ userId: id }),
        }
      );
      if (!res.ok) {
        toast.error("Failed to delete user and other posts");
        return;
      }
      setIsDeleteLoading(false);
      navigate("/login");
      localStorage.removeItem(
        `sb-${import.meta.env.VITE_SUPABASE_PROJECT_ID}-auth-token`
      );
      setIsModalOpen(false);
      setCurrentUser(null);
      setUser(null);
      toast.dismiss(loadingID);
      toast.success("Account and all of your was successfully deleted.");
    } catch (error) {
      console.error("error:", error);
      toast.error("Can't delete your account!!!");
    }
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        // title="Are you sure want to delete your account and all posts?"
        showCloseBtn={false}
      >
        <div className="w-[300px] md:w-[500px]">
          <h1 className="text-xl">
            Are you sure want to delete your account and all posts?
          </h1>
          <div className="flex-center justify-self-end mt-5 p-1">
            <Button
              type="button"
              className="shad-button_dark_4 bg-[#2b2b2b] cursor-pointer mr-3"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="shad-button_dark_4 bg-black text-red-500 border-red-500 border-1 cursor-pointer"
              onClick={handleDeleteAccountAndPosts}
            >
              {isDeleteLoading ? (
                <>
                  <Loader /> Deleting...
                </>
              ) : (
                "Delete account and posts"
              )}
            </Button>
          </div>
        </div>
      </Modal>

      <div className="flex flex-1">
        <div className="common-container custom-scrollbar">
          <div className="flex-start gap-3 justify-start w-full max-w-5xl">
            <img
              src="/assets/icons/edit.svg"
              width={36}
              height={36}
              alt="edit"
              className="invert-white"
            />
            <h2 className="h3-bold md:h2-bold text-left w-full">
              Edit Profile
            </h2>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpdate)}
              className="flex flex-col gap-7 w-full mt-4 max-w-5xl"
            >
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem className="flex">
                    <FormControl>
                      <ProfileUploader
                        fieldChange={field.onChange}
                        mediaUrl={currentUser.imageUrl}
                      />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="shad-input bg-[#101012] "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="shad-input bg-[#101012]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="shad-input bg-[#101012]"
                        {...field}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        className="shad-textarea custom-scrollbar bg-[#101012]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button
                  type="button"
                  className="shad-button_dark_4 bg-black text-red-500 border-red-500 border-1 cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
                  Delete Account
                </Button>
                <div className="flex items-center justify-end md:gap-4">
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
                    disabled={isLoadingUpdate}
                  >
                    {isLoadingUpdate && <Loader />}
                    Update Profile
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;
