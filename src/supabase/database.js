import supabase from "./config";
import { tableNames } from "../lib/constants";
import { v4 as uuidV4 } from "uuid";

async function saveUserToDB(insertObj) {
  // {
  //   accountId: newAccount.$id,
  //   name: newAccount.name,
  //   email: newAccount.email,
  //   username: user.username,
  //   imageUrl: avatarUrl,
  // }
  try {
    const { data, error } = await supabase
      .from(tableNames.users)
      .insert(insertObj);
    if (error) {
      console.error("error:", error);
      throw Error;
    }

    return { success: true, data };
  } catch (error) {
    console.error("error:", error.message);
    return { success: false, msg: error.message };
  }
}

async function getCurrentUser() {
  try {
    const d = await supabase.auth.getSession();
    if (d) {
      const { data: dataObj, error } = await supabase
        .from(tableNames.users)
        .select("*")
        .eq("accountId", d.data.session.user.id);
      if (error) {
        console.error("error:", error);
        throw Error;
      }
      return { success: true, data: dataObj[0] };
    }
  } catch (error) {
    console.error("error:", error.message);
    return { success: false, msg: error.message };
  }
}

async function createPost(userId, post) {
  if (!userId) {
    console.log("user id is not found");
    return;
  }
  try {
    // NOTE:upload file to storage.
    const { imageId, uploadedFileUrl } = await uploadFile(userId, post.file[0]);
    const tags = post.tags?.replace(/ /g, "").split(",") || [];
    const insertObj = {
      caption: post?.caption,
      location: post?.location,
      tags,
      imageId,
      imageUrl: uploadedFileUrl,
      creator: userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    console.log("insertObj:", insertObj);
    // NOTE:post file to database.
    const { error } = await supabase.from(tableNames.posts).insert(insertObj);
    if (error?.message) {
      throw Error;
    }
    return { success: true };
  } catch (error) {
    console.error("error:", error.message);
    return { success: false, msg: error.message };
  }
}

async function uploadFile(userId, file, updatePostId = undefined) {
  try {
    const fileExt =
      file[0]?.name?.split(".").pop() || file?.name?.split(".").pop() || "png";
    const uniqueId = uuidV4();
    const filePath = `${userId}/${uniqueId}.${fileExt}`;
    console.log("filePath:", filePath);
    const f = updatePostId ? file[0] : file;
    if (!userId || !f) {
      console.error("user id or file can't get properly");
      return;
    }

    // Upload to Supabase storage
    // NOTE: upsert is inserting new row if already exist update itself(insert+update=upsert)
    const { error } = await supabase.storage.from("media").upload(filePath, f, {
      upsert: true,
    });

    if (error) {
      console.error("Upload error:", error);
      throw new Error(error.message || "Failed to upload file");
    }

    // Get public URL (if bucket is public)
    const { data } = supabase.storage.from("media").getPublicUrl(filePath);

    if (!data?.publicUrl) {
      throw new Error("Failed to retrieve public URL");
    }

    // NOTE: After uploaded safely we need to delete existing file(old image or upate post file)
    if (updatePostId?.imgId && updatePostId?.imgUrl) {
      await deleteFile(updatePostId);
    }

    return { imageId: uniqueId, uploadedFileUrl: data.publicUrl };
  } catch (error) {
    console.error("UploadFile error:", error.message);
    return { success: false, msg: error.message };
  }
}

async function getInfinitePosts() {
  try {
    const { data, error } = await supabase
      .from(tableNames.posts)
      .select("*, creator:posts_creator_fkey(*)")
      .limit(9)
      .order("updatedAt", { ascending: false });
    if (error) {
      console.error("error:", error);
      throw Error;
    }

    return { success: true, data };
  } catch (error) {
    console.error("error:", error.message);
    return { success: false, msg: error.message };
  }
}

async function getUsers(userId) {
  if (!userId) {
    console.error(
      "You can’t fetch other users unless you provide your own user ID"
    );
    return;
  }
  // TODO: except myself and followers
  try {
    const { data, error } = await supabase
      .from(tableNames.users)
      .select("imageUrl,name,username")
      .limit(10)
      .neq("accountId", userId);
    if (error) {
      console.error("error:", error);
      throw Error;
    }

    return { success: true, data };
  } catch (error) {
    console.error("error:", error.message);
    return { success: false, msg: error.message };
  }
}

async function getPostById(postId) {
  if (!postId) {
    console.error("You can’t fetch post unless you provide your post ID");
    return;
  }
  try {
    const { data, error } = await supabase
      .from(tableNames.posts)
      .select("*")
      .eq("imageId", postId);
    if (error) {
      console.error("error:", error);
      throw Error;
    }
    return data;
  } catch (error) {
    console.error("error:", error.message);
    return { success: false, msg: error.message };
  }
}
async function updatePost(post) {
  // NOTE: after clicking update button.
  if (!post) {
    console.error("Your post has been not found");
    return;
  }
  const hasFileToUpdate = post.file.length > 0;
  const updateObj = {
    imageId: post.imageId,
    caption: post.caption,
    location: post.location,
    tags: post.tags?.replace(/ /g, "").split(",") || [],
  };
  try {
    if (hasFileToUpdate) {
      const { imageId, uploadedFileUrl } = await uploadFile(
        post?.userId,
        post?.file,
        { userId: post.userId, imgId: post?.imageId, imgUrl: post.imageUrl }
      );

      if (!uploadedFileUrl) {
        console.error("Failed to upload a file");
        return;
      }
      updateObj.imageId = imageId;
      updateObj.imageUrl = uploadedFileUrl;
    }
    const { error } = await supabase
      .from(tableNames.posts)
      .update(updateObj)
      .eq("imageId", post?.imageId);
    if (error) {
      console.error("error:", error);
      throw Error;
    }
    return true;
  } catch (error) {
    console.error("error:", error.message);
    return { success: false, msg: error.message };
  }
}
async function deleteFile(oldFile) {
  // NOTE: after clicking update button.
  if (!oldFile) {
    console.error("Your post has been not found");
    return;
  }
  try {
    const fileExt =
      oldFile.imgUrl[0]?.name?.split(".").pop() ||
      oldFile.imgUrl?.name?.split(".").pop() ||
      "png";
    const { error } = await supabase.storage
      .from("media")
      .remove([`${oldFile.userId}/${oldFile.imageId}.${fileExt}`]);
    if (error) {
      console.erro("error:", error);
      return;
    }
  } catch (error) {
    console.error("error:", error.message);
    return { success: false, msg: error.message };
  }
}

export {
  saveUserToDB,
  getCurrentUser,
  createPost,
  getInfinitePosts,
  getUsers,
  getPostById,
  updatePost,
};
