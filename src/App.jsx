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

// TODO:Mobile screen loading or empty screen fix - Done
// TODO:Hashtags on vertical in home page and edit button and location in home page - Done
// TODO:hashtags overflow in post details - Done
// TODO:Comments not update in home page - Done
// TODO:follower search lowercase in profile page - Done
// TODO:comments 400px (maybe modal need to be fix) - Done
// TODO:Delete account btn spacing - Done

// NOTE: modal exist in comment,follower/following,delete account

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
