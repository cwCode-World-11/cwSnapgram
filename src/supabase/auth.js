import supabase from "./config";

async function signUp(email, password) {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error("error:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("error:", error);
    return { success: false, msg: error.message };
  }
}
async function login(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("error:", error.message);
      return { success: false, msg: error.message };
    }
    return { success: true, data };
  } catch (error) {
    console.error("error:", error.message);
    return { success: false, msg: error.message };
  }
}
async function logOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("error:", error);
      return { success: false, msg: error.message };
    }

    return true;
  } catch (error) {
    console.error("error:", error);
    return { success: false, msg: error.message };
  }
}
// supabase call that sends reset link
async function forgetPasswordSendResetLinkOnEmail(email) {
  if (!email) return;
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/update-user?action=reset",
    });
    if (error) {
      console.error("error:", error);
      return { success: false, msg: error.message };
    }
    return true;
  } catch (error) {
    console.error("error:", error);
    return { success: false, msg: error.message };
  }
}

export { signUp, login, logOut, forgetPasswordSendResetLinkOnEmail };
