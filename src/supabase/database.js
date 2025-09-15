import supabase from "./config";
import {
  COMMENTS,
  FOLLOWS,
  LIKES,
  PAGE_SIZE,
  SAVES,
  SUPABASE_QUERY,
  tableNames,
} from "../lib/constants";
import { v4 as uuidV4 } from "uuid";

// NOTE:Don't delete this code
// .from(tableNames.likes)
// .select("*,posts:posts!like_postId_fkey(*)");
// [{likes column...,posts:{postsTable column...}}]

//seleted post table
// liked:likes!likes_postId_fkey(
//       userId,
//         user:likes!likes_userId_fkey(*)
//       )
// NOTE:otherTable selected<alias>:<whichDataINeedTable>!<foreignKeyedTable>_<foreignKeyedTableColumn>_fkey(*)
// NOTE:foreignKeyedTable has foreign key

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
      throw new Error("Error");
    }

    return { success: true, data };
  } catch (error) {
    console.error("error:", error.message);
    return { success: false, msg: error.message };
  }
}

async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Session error:", error.message);
      return { success: false, msg: error.message };
    }

    const session = data?.session;
    if (!session?.user) {
      return { success: false, msg: "No active session" };
    }

    const { data: dataObj, error: dbError } = await supabase
      .from(tableNames.users)
      .select("*")
      .eq("accountId", session?.user?.id)
      .single(); // get just one row

    if (dbError) {
      console.error("DB error:", dbError.message);
      return { success: false, msg: dbError.message };
    }

    return { success: true, data: dataObj };
  } catch (error) {
    console.error("Unexpected error:", error.message);
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
    const date = Date.now();
    const insertObj = {
      caption: post?.caption,
      location: post?.location,
      tags,
      imageId,
      imageUrl: uploadedFileUrl,
      creator: userId,
      createdAt: date,
      updatedAt: date,
    };

    // NOTE:post file to database.
    const { error } = await supabase.from(tableNames.posts).insert(insertObj);
    if (error?.message) {
      throw new Error("Error");
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
    const f = updatePostId ? file?.[0] : file;
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

async function getInfinitePosts(pageParam) {
  const from = Number(pageParam) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  try {
    // .select("*, creator:posts_creator_fkey(*)");
    const { data, error } = await supabase
      .from(tableNames.posts)
      .select(
        `${SUPABASE_QUERY.posts.getAllColumn},${SUPABASE_QUERY.posts.getUsers},${SUPABASE_QUERY.posts.getLiked},${SUPABASE_QUERY.posts.getSaved},${SUPABASE_QUERY.posts.getComments}`
      )
      .order("updatedAt", { ascending: false })
      .range(from, to);
    // .limit(9);

    if (error) {
      console.error("error:", error);
      throw new Error("Error");
    }
    return { success: true, data };
  } catch (error) {
    console.error("error:", error.message);
    return { success: false, msg: error.message };
  }
}

async function getUsers(userId) {
  if (!userId) {
    return;
  }
  try {
    const { data, error } = await supabase
      .from(tableNames.users)
      .select("*")
      .limit(20)
      .neq("accountId", userId);
    // .neq("userId", userId);
    if (error) {
      console.error("error:", error);
      return [];
    }
    const { data: followsData, error: followsError } = await supabase
      .from(tableNames.follows)
      .select("*")
      .eq("userId", userId);
    if (followsError) {
      console.error("error:", followsError);
      return [];
    }

    return { success: true, data, currentUserFollowing: followsData };
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
      .select(
        `${SUPABASE_QUERY.posts.getAllColumn},${SUPABASE_QUERY.posts.getUsers},${SUPABASE_QUERY.posts.getLiked},${SUPABASE_QUERY.posts.getSaved},${SUPABASE_QUERY.posts.getComments}`
      )
      .eq("imageId", postId);
    if (error) {
      console.error("error:", error);
      throw new Error("Error");
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
  const date = Date.now();
  const updateObj = {
    imageId: post.imageId,
    caption: post.caption,
    location: post.location,
    tags: post.tags?.replace(/ /g, "").split(",") || [],
    updatedAt: date,
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
      throw new Error("Error");
    }
    return updateObj.imageId;
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
      console.error("error:", error);
      return;
    }
  } catch (error) {
    console.error("error:", error.message);
    return { success: false, msg: error.message };
  }
}

// NOTE: get other posts from same(own) user
async function getUserPosts(userId) {
  if (!userId) return;
  try {
    const { data, error } = await supabase
      .from(tableNames.posts)
      .select(
        `${SUPABASE_QUERY.posts.getAllColumn},${SUPABASE_QUERY.posts.getUsers},${SUPABASE_QUERY.posts.getLiked},${SUPABASE_QUERY.posts.getSaved},${SUPABASE_QUERY.posts.getComments}`
      )
      .order("updatedAt", { ascending: false })
      .eq("creator", userId);

    if (error) {
      console.error("error:", error);
      throw new Error("Error");
    }

    return data;
  } catch (error) {
    console.error("error:", error.message);
    return { success: false, msg: error.message };
  }
}

async function deletePost(imageId, imgUrl) {
  if (!imageId || !imgUrl) return;
  try {
    const deletedImg = await deleteFileFromStorage(imgUrl);
    if (!deletedImg) {
      return;
    }
    const { error } = await supabase
      .from(tableNames.posts)
      .delete()
      .eq("imageId", imageId);

    if (error) {
      console.error("error:", error);
      return;
    }

    return true;
  } catch (error) {
    console.error("error:", error);
    return { success: false, msg: error.message };
  }
}
async function likePost(postId, userId, action) {
  if (!postId || !userId || !action) return;
  try {
    if (action === LIKES.likePost) {
      const { error } = await supabase
        .from(tableNames.likes)
        .insert({ id: uuidV4(), postId, userId });
      if (error) {
        console.error("error:", error);
        return;
      }
    } else {
      const { error } = await supabase
        .from(tableNames.likes)
        .delete()
        .eq("postId", postId)
        .eq("userId", userId);

      if (error) {
        console.error("error:", error);
        return;
      }
    }

    return true;
  } catch (error) {
    console.error("error:", error.message);
    return { success: false, msg: error.message };
  }
}
async function savePost(postId, userId, action) {
  if (!postId || !userId || !action) return;
  try {
    if (action === SAVES.savePost) {
      const { error } = await supabase
        .from(tableNames.saves)
        .insert({ id: uuidV4(), postId, userId });
      if (error) {
        console.error("error:", error);
        return;
      }
    } else {
      const { error } = await supabase
        .from(tableNames.saves)
        .delete()
        .eq("postId", postId)
        .eq("userId", userId);

      if (error) {
        console.error("error:", error);
        return;
      }
    }

    return true;
  } catch (error) {
    console.error("error:", error.message);
    return { success: false, msg: error.message };
  }
}
async function followUser(followsId, userId, action) {
  if (!followsId || !userId || !action) return;
  try {
    if (action === FOLLOWS.notFollowing) {
      const { error } = await supabase
        .from(tableNames.follows)
        .insert({ id: uuidV4(), followsId, userId });
      if (error) {
        console.error("error:", error);
        return;
      }
    } else {
      const { error } = await supabase
        .from(tableNames.follows)
        .delete()
        .eq("userId", userId)
        .eq("followsId", followsId);

      if (error) {
        console.error("error:", error);
        return;
      }
    }

    return { success: true, followsId };
  } catch (error) {
    console.error("error:", error.message);
    return { success: false, msg: error.message };
  }
}

async function getUserById(userId) {
  if (!userId) return;
  try {
    const { data, error } = await supabase
      .from(tableNames.users)
      .select(
        `${SUPABASE_QUERY.users.getAllColumn},
${SUPABASE_QUERY.users.getFollowers},${SUPABASE_QUERY.users.getFollowing}`
      )
      .eq("accountId", userId)
      .single();

    if (error) {
      console.error("error:", error);
      return;
    }
    const { data: posts, error: postsError } = await supabase
      .from(tableNames.posts)
      .select(
        `${SUPABASE_QUERY.posts.getLiked},${SUPABASE_QUERY.posts.getSaved},${SUPABASE_QUERY.posts.getUsers},${SUPABASE_QUERY.posts.getAllColumn},${SUPABASE_QUERY.posts.getComments}`
      )
      .order("updatedAt", { ascending: false })
      .eq("creator", userId);

    if (postsError) {
      console.error("error:", postsError);
      return;
    }

    data.posts = posts;

    return data;
  } catch (error) {
    console.error("error:", error.message);
    return { success: false, msg: error.message };
  }
}

async function getLikedOrSavedPost(userId, ennaVennumUnnakku = "liked") {
  // Fun fact: ennaVennumUnnakku(song from thug life movie(2025))
  if (!userId || !ennaVennumUnnakku) {
    return;
  }
  try {
    const tableName =
      ennaVennumUnnakku === "liked" ? tableNames.likes : tableNames.saves;
    const query =
      ennaVennumUnnakku === "liked"
        ? `posts:likes_postId_fkey(*,creator:users!posts_creator_fkey(*))`
        : `posts:saves_postId_fkey(*,creator:users!posts_creator_fkey(*))`;

    const { data, error } = await supabase
      .from(tableName)
      .select(query)
      .eq("userId", userId);
    if (error) {
      console.error("error:", error);
      return;
    }
    const flatPost = data.map((p) => p.posts).reverse();

    return flatPost;
  } catch (error) {
    console.error("error:", error.message);
    return { success: false, msg: error.message };
  }
}

async function updateUser(userObj) {
  if (!userObj) {
    return;
  }
  const insertRowData = {
    name: userObj.name,
    bio: userObj.bio,
    username: userObj.username,
    accountId: userObj.accountId,
    email: userObj.email,
    imageUrl: userObj.imageUrl,
  };
  try {
    // NOTE: is profile picture also need to be upload?
    if (userObj?.file !== null && userObj?.file?.length > 0) {
      // file upload
      const profilePictureUrl = await updateProfilePicture(
        userObj.accountId,
        userObj.file
      );

      if (profilePictureUrl) {
        insertRowData.imageUrl = profilePictureUrl;
      }
    }

    const { error } = await supabase
      .from(tableNames.users)
      .upsert(insertRowData, { onConflict: "accountId" }) //NOTE:insert+update=upsert
      .eq("accountId", userObj.accountId);
    if (error) {
      console.error("error:", error);
      return;
    }

    const { accountId, email, name, username, bio } = insertRowData;

    return {
      accountId,
      email,
      name,
      username,
      bio,
      imageUrl: insertRowData?.imageUrl,
    };
  } catch (error) {
    console.error("error:", error.message);
    return { success: false, msg: error.message };
  }
}

async function updateProfilePicture(userId, file) {
  if (!userId || !file) {
    return;
  }
  try {
    const actualFile = Array.isArray(file) ? file[0] : file;
    const fileExt = actualFile.name.split(".").pop();

    const fileName = "profilePicture" + userId;
    const filePath = `${userId}/${fileName}.${fileExt}`;
    const filePathArrToDel = [
      `${userId}/${fileName}.png`,
      `${userId}/${fileName}.jpg`,
      `${userId}/${fileName}.jpeg`,
    ];

    const { error: removeErr } = await supabase.storage
      .from("media")
      .remove(filePathArrToDel);
    if (removeErr) {
      console.log("No existing profilePicture found to delete.");
    } else {
      console.log("Old profilePicture deleted successfully.");
    }

    const { error } = await supabase.storage
      .from("media")
      .upload(filePath, actualFile, { upsert: true });
    if (error) {
      console.error("error:", error);
      return;
    }

    const { data } = await supabase.storage
      .from("media")
      .getPublicUrl(filePath);
    if (!data) {
      return;
    }
    return `${data?.publicUrl}?t=${Date.now()}`;
  } catch (error) {
    console.error("error:", error);
  }
}

async function deleteFileFromStorage(imgUrl) {
  if (!imgUrl) {
    return;
  }
  // Strip query params if present
  const cleanUrl = imgUrl.split("?")[0];

  // Split into parts
  const parts = cleanUrl.split("/");

  // userId = 2nd last part, fileName = last part
  const userId = parts[parts.length - 2];
  const fileName = parts[parts.length - 1];

  // Extract extension (after last ".")
  // const fileExt = fileName.includes(".") ? fileName.split(".").pop() : null;

  try {
    const filePath = `${userId}/${fileName}`;
    console.log("filePath:", filePath);
    const { error } = await supabase.storage.from("media").remove([filePath]);
    if (error) {
      console.log("error:", error);
      return;
    }

    return true;
  } catch (error) {
    console.error("error:", error);
  }
}

async function searchPosts(searchTerm) {
  if (!searchTerm) {
    return;
  }

  try {
    const { error, data } = await supabase
      .from(tableNames.posts)
      .select(
        `*,${SUPABASE_QUERY.posts.getLiked},${SUPABASE_QUERY.posts.getSaved},${SUPABASE_QUERY.posts.getUsers},${SUPABASE_QUERY.posts.getComments}`
      )
      .ilike("caption", `%${searchTerm}%`);
    if (error) {
      console.log("error:", error);
      return;
    }

    return data;
  } catch (error) {
    console.error("error:", error);
  }
}

async function getFollowingAndFollowers(userId) {
  // NOTE: following,followers,search
  if (!userId) {
    return;
  }
  try {
    const followers = await fetchRelation(
      "followers",
      "followsId",
      "follows_userId_fkey",
      userId
    );

    const following = await fetchRelation(
      "following",
      "userId",
      "follows_followsId_fkey",
      userId
    );

    // console.log("d:", [...followers, ...following]);

    return [...followers, ...following];
  } catch (error) {
    console.error("Error getting users" + error);
  }
}

async function fetchRelation(relation, column, fkey, userId) {
  try {
    const { data, error } = await supabase
      .from(tableNames.follows)
      .select(`${relation}:users!${fkey}(*)`)
      .eq(column, userId);

    if (error) {
      console.error(`Error fetching ${relation}:`, error);
      return [];
    }

    return data.map((list) => ({
      ...list[relation],
      type: relation,
    }));
  } catch (error) {
    console.error("error:", error);
  }
}

async function getSearchUser(userId, searchTearm) {
  if (!searchTearm || !userId) {
    return;
  }
  // NOTE: columnName.ilike.%${searchTearm}%=name.ilike.%${searchTearm}%,
  // NOTE: ilike=inCaseSensitive, %=whereToStart
  try {
    const { data, error } = await supabase
      .from(tableNames.users)
      .select("*")
      .or(
        `name.ilike.%${searchTearm}%,username.ilike.%${searchTearm}%,accountId.ilike.%${searchTearm}%`
      )
      .neq("accountId", userId);
    if (error) {
      console.error("error:", error);
      return false;
    }

    const { data: followsData, error: followsError } = await supabase
      .from(tableNames.follows)
      .select("*")
      .eq("userId", userId);
    if (followsError) {
      console.error("error:", followsError);
      return false;
    }

    return { data, following: followsData.map((f) => f.followsId) };
  } catch (error) {
    console.error("error:", error);
  }
}

// NOTE: only for read
async function comments(postId) {
  if (!postId) {
    return;
  }
  try {
    const { data, error } = await supabase
      .from(tableNames.comments)
      .select("users:users!comments_userId_fkey(*),*")
      .eq("postId", postId);
    if (error) {
      console.error("error:", error);
      return false;
    }
    return data;
  } catch (error) {
    console.error("error:", error);
  }
}

// NOTE: create, update, delete
async function handleComment(cmtObj) {
  if (!cmtObj.action) {
    return;
  }
  try {
    const { action } = cmtObj;

    if (action === COMMENTS.comment) {
      if (cmtObj.comment) {
        const { error } = await supabase
          .from(tableNames.comments)
          .insert(cmtObj.comment);
        if (error) {
          console.error("error:", error);
          return false;
        }
        return true;
      }
    }
    if (action === COMMENTS.edit) {
      if (cmtObj.editId) {
        const { error } = await supabase
          .from(tableNames.comments)
          .update(cmtObj.comment)
          .eq("commentId", cmtObj.editId);
        if (error) {
          console.error("error:", error);
          return false;
        }
        return true;
      }
    }
    if (action === COMMENTS.deleteComment) {
      if (cmtObj.deleteCommentId) {
        const { error } = await supabase
          .from(tableNames.comments)
          .delete()
          .eq("commentId", cmtObj.deleteCommentId);
        if (error) {
          console.error("error:", error);
          return false;
        }
        return true;
      }
    }
  } catch (error) {
    console.error("error:", error);
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
  getUserPosts,
  deletePost,
  likePost,
  savePost,
  followUser,
  getUserById,
  getLikedOrSavedPost,
  updateUser,
  searchPosts,
  getFollowingAndFollowers,
  getSearchUser,
  comments,
  handleComment,
};
