import { Routes, Route } from "react-router";
import AuthLayout from "./_auth/AuthLayout";
import Login from "./_auth/forms/Login";
import Signup from "./_auth/forms/Signup";
import ForgetPassword from "./_auth/forms/ForgetPassword";
import UpdateUser from "./_auth/forms/UpdateUser";
import RootLayout from "./_root/RootLayout";
import { Toaster } from "react-hot-toast";
import {
  Home,
  Explore,
  Saved,
  AllUsers,
  CreatePost,
  EditPost,
  PostDetails,
  Profile,
  UpdateProfile,
} from "@/_root/pages";

// TODO: Comment
// TODO: don't forget to change redirect url on supabase(localhost by default) for forgetPassword while deploying no need to hard code on react.

function App() {
  return (
    <main>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/update-user" element={<UpdateUser />} />
        </Route>

        {/* Private Routes */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
        </Route>

        {/* PAGE NOT FOUND!!! */}
        <Route path="*" element={<h1>404 Not Found Error</h1>} />
      </Routes>
      <Toaster position="bottom-center" />
    </main>
  );
}

export default App;
