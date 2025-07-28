import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import cLogo from "/assets/cLogo-removebg.png";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Link } from "react-router";
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

const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be atleast 3 characters." }),
  username: z
    .string()
    .min(3, { message: "username must be unique and atleast 3 characters." }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be atleast 8 characters!" }),
});

const Signup = () => {
  const isLoading = true;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  function onSignUp() {
    toast.success("Account was created successfully");
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
          {isLoading ? (
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
