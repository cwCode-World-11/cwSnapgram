import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import cLogo from "/assets/cLogo-removebg.png";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Link, useNavigate } from "react-router";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { SignupValidation as formSchema } from "../../lib/validation";
import { signUp } from "../../supabase/auth";
import { useSaveUserToDB } from "../../lib/tanstackQuery/queries";

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });
  const {
    mutateAsync: saveUserToDB,
    isSaveToDBLoading,
    error,
  } = useSaveUserToDB();

  const navigate = useNavigate();

  async function onSignUp(user) {
    setIsLoading(true);
    try {
      // NOTE: creating account in supabase.
      const newUser = await signUp(user.email, user.password);
      if (newUser.success === false) {
        toast.error(newUser.msg);
        return;
      }
      toast.success("Account was created successfully");

      // NOTE: creating table in supabase
      const len =
        user?.name.split(" ").lenth > 1 ? user?.name.split(" ").lenth : 1;
      const u = {
        accountId: newUser.data.user.id,
        email: newUser.data.user.email,
        name: user.name,
        username: user.username,
        imageUrl: `https://ui-avatars.com/api/?name=${user?.name}&size=256&bold=true&length=${len}`,
      };
      await saveUserToDB(u);
      toast("Saving user data database...");
      if (error) {
        toast.error("Failed to insert data in database");
        return;
      }
      form.reset();
      navigate("/");
    } catch (error) {
      console.error("error:", error);
      toast.error("Error while signing or creating database");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <div className="flex-center w-40">
        <img src={cLogo} alt="logo" />
      </div>
      <h1 className="text-2xl mt-5">Create a new account</h1>
      <p className="text-light-3 small-medium md:base-regular m-2">
        To use cwSnapgram, Please enter your details
      </p>
      <form
        onSubmit={form.handleSubmit(onSignUp)}
        className="w-full flex-center flex-col gap-5 mt-3"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-[50%]">
              <FormLabel className="shad-form_label text-light-2 text-xs">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input bg-[#1f1f22] h-10"
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
            <FormItem className="w-[50%]">
              <FormLabel className="shad-form_label text-light-2 text-xs">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input bg-[#1f1f22] h-10"
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
            <FormItem className="w-[50%]">
              <FormLabel className="shad-form_label text-light-2 text-xs">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input bg-[#1f1f22] h-10"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-[50%]">
              <FormLabel className="shad-form_label text-light-2 text-xs">
                Password
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  className="shad-input bg-[#1f1f22] h-10"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="shad-button_primary w-[50%]"
          variant="primary"
        >
          {isLoading || isSaveToDBLoading ? (
            <div className="flex-center gap-2">
              <Loader /> Loading...
            </div>
          ) : (
            "Sign Up"
          )}
        </Button>

        <p className="text-small-regular text-light-2 text-center mt-2">
          Already have an account?
          <Link
            to="/login"
            className="text-primary-500 text-small-semibold ml-1 "
          >
            Log in
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default Signup;
