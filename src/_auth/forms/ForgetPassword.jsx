import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import cLogo from "/assets/cLogo-removebg.png";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Link } from "react-router";
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
import { ForgetPasswordValidation as formSchema } from "../../lib/validation";
import { forgetPasswordSendResetLinkOnEmail } from "../../supabase/auth";

const ForgetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [checkEmailMsg, setCheckEmailMsg] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function sendResetLinkOnEmail(user) {
    setIsLoading(true);
    try {
      if (!user.email) {
        return;
      }
      const u = await forgetPasswordSendResetLinkOnEmail(user.email);
      if (u.success === false) {
        toast.error(u.msg);
        return;
      }
      form.reset();
      setCheckEmailMsg(`Check your email(${user.email})...`);
      toast.success("Reset link send on your email successful");
    } catch (error) {
      console.error("error:", error);
      toast.error("Error while sending reset link on your email");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <div className="flex-center w-40">
        <img src={cLogo} alt="logo" />
      </div>
      <h1 className="text-2xl mt-5 ">Forget Password</h1>
      <p className="text-light-3 small-medium md:base-regular m-2">
        Please enter your email to send reset link
      </p>
      {!checkEmailMsg ? (
        <form
          onSubmit={form.handleSubmit(sendResetLinkOnEmail)}
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
              "Forget Password"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            {!checkEmailMsg ? "Don't want to reset?" : "Go back to "}
            <Link
              to="/login"
              className="text-primary-500 text-small-semibold ml-1 "
            >
              Login
            </Link>
          </p>
        </form>
      ) : (
        <>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Go back to
            <Link
              to="/login"
              className="text-primary-500 text-small-semibold ml-1 "
            >
              Login
            </Link>
          </p>
          <p className="text-3xl p-3">{`${checkEmailMsg}`}</p>
        </>
      )}
    </Form>
  );
};

export default ForgetPassword;
