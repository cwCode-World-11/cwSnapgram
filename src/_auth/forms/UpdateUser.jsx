import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import cLogo from "/assets/cLogo-removebg.png";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
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
import { UpdatePasswordValidation as formSchema } from "../../lib/validation";
import supabase from "../../supabase/config";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router";

const UpdateUser = () => {
  // Destructure isAuthLoading from useAuth()
  const { currentUser, isAuthLoading, setCurrentUser, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [tokensMissing, setTokensMissing] = useState(false);
  const [pasteUrl, setPasteUrl] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "" },
  });

  useEffect(() => {
    let mounted = true;

    // Only proceed when AuthProvider has finished its initial loading
    if (!isAuthLoading && mounted) {
      if (currentUser) {
        console.log(
          "[UpdateUser] AuthProvider has a user session. Ready to update password."
        );
        setSessionReady(true);
        setTokensMissing(false);
      } else {
        console.log("[UpdateUser] AuthProvider has no user session.");
        setSessionReady(false);
        setTokensMissing(true);
      }
    }
    // Cleanup the URL hash from the redirect to make it cleaner
    const rawHash = window.location.hash.replace(/^#/, "");
    if (rawHash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }

    return () => {
      mounted = false;
    };
  }, [currentUser, isAuthLoading]); // Depend on currentUser and isAuthLoading

  useEffect(() => {
    const handleWatch = async (e, s) => {
      if (e === "USER_UPDATED") {
        toast.success("Password updated successfully!");
        setSuccessMsg(
          "Password updated. You can now close the tab and sign in with your new password."
        );
        localStorage.removeItem("supabase:pw_recovery");
        localStorage.removeItem(
          `sb-${import.meta.env.VITE_SUPABASE_PROJECT_ID}-auth-token`
        );
        setCurrentUser(null);
        setUser(null);
        toast("Logged out");
        form.reset();
      }
    };

    const sub = supabase.auth.onAuthStateChange(handleWatch);

    return () => {
      try {
        sub.data.subscription?.unsubscribe();
      } catch (err) {
        console.warn("unsubscribe error", err);
      }
    };
  }, []);

  const handlePasteUrl = async () => {
    if (!pasteUrl) {
      toast.error("Please paste the reset link URL from your email.");
      return;
    }

    // ... (rest of the handlePasteUrl function, which seems correct)
    try {
      const u = new URL(pasteUrl.trim());
      const rawHash = u.hash.replace(/^#/, "");
      const rawSearch = u.search.replace(/^\?/, "");
      const params = new URLSearchParams(rawHash || rawSearch);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (!access_token || !refresh_token) {
        toast.error(
          "No tokens found in that URL. Make sure you pasted the final redirected URL that contains #access_token=..."
        );
        return;
      }

      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
      console.log("setSession from paste result:", error);
      if (error) {
        toast.error(
          "Failed to set session: " + (error.message || JSON.stringify(error))
        );
        return;
      }
      toast.success(
        "Recovery session restored — you can now set a new password."
      );
    } catch (err) {
      console.error("Error parsing/setting session from pasted URL:", err);
      toast.error("Invalid URL or unexpected error.");
    }
  };

  async function onUpdatePassword(values) {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });
      console.log("i'm here");

      if (error) {
        toast.error("Error: " + error.message);
      } else {
        localStorage.removeItem("supabase:pw_recovery");
        localStorage.removeItem(
          `sb-${import.meta.env.VITE_SUPABASE_PROJECT_ID}-auth-token`
        );
        setCurrentUser(null);
        setUser(null);

        setSuccessMsg(
          "Password updated. You can now close the tab and sign in with your new password."
        );
        form.reset();
      }
    } catch (err) {
      console.error("error while changing password:", err);
      toast.error("Error while changing password");
    } finally {
      setIsLoading(false);
    }
  }

  // Final render logic
  const renderContent = () => {
    if (isAuthLoading) {
      return <Loader />;
    }

    if (successMsg) {
      return (
        <>
          <p className="text-3xl p-3">{successMsg}</p>
          <Link to="/login" className="text-blue-500">
            Go back to login
          </Link>
        </>
      );
    }

    if (tokensMissing) {
      return (
        <div className="mb-4 p-3">
          <p className="text-sm text-yellow-400 mb-2">
            No recovery session detected. Try opening the email link in the{" "}
            <strong>same tab</strong>, or paste the final redirected URL (the
            one that contains <code>#access_token=</code>) below.
          </p>
          <div className="flex gap-2">
            <input
              className="p-2 bg-[#1f1f22] text-white"
              placeholder="Paste full reset URL here"
              value={pasteUrl}
              onChange={(e) => setPasteUrl(e.target.value)}
            />
            <button
              onClick={handlePasteUrl}
              className="p-2 bg-green-600 text-white rounded"
            >
              Restore Session
            </button>
          </div>
        </div>
      );
    }

    if (sessionReady) {
      return (
        <form
          onSubmit={form.handleSubmit(onUpdatePassword)}
          className="w-full flex-center flex-col gap-5 mt-3"
        >
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
              "Update Password"
            )}
          </Button>
        </form>
      );
    }

    return null; // Fallback for other states
  };

  return (
    <Form {...form}>
      <div className="flex-center w-40">
        <img src={cLogo} alt="logo" />
      </div>
      <h1 className="text-2xl mt-5 ">Update password</h1>
      <p className="text-light-3 small-medium md:base-regular m-2">
        What would you like your new password to be?
      </p>
      {renderContent()}
    </Form>
  );
};

export default UpdateUser;
