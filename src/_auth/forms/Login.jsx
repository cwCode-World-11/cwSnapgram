import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import cLogo from "/assets/cLogo-removebg.png";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Link, useNavigate } from "react-router";
import Loader from "../../components/Loader";
import { toast } from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { SigninValidation as formSchema } from "../../lib/validation";
import { login } from "../../supabase/auth";

const Login = () => {
  const [isLoading, setIsLoading] = useState();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onLogin(user) {
    setIsLoading(true);
    try {
      const u = await login(user.email, user.password);
      if (u.success === false) {
        toast.error(u.msg);
        return;
      }
      form.reset();
      navigate("/");
      toast.success("Log in successful");
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
      <h1 className="text-2xl mt-5 ">Login in to your account</h1>
      <p className="text-light-3 small-medium md:base-regular m-2">
        Welcome back!, Please enter your details
      </p>
      <form
        onSubmit={form.handleSubmit(onLogin)}
        className="w-full flex-center flex-col gap-5 mt-3"
      >
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
            "Login"
          )}
        </Button>

        <p className="text-small-regular text-light-2 text-center mt-2">
          Don't have an account?
          <Link
            to="/sign-up"
            className="text-primary-500 text-small-semibold ml-1 "
          >
            Sign Up
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default Login;
