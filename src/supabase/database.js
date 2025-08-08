import supabase from "./config";
import { PAGE_SIZE, tableNames } from "../lib/constants";
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
    const d = await supabase.auth.getSession();
    if (d) {
      const { data: dataObj, error } = await supabase
        .from(tableNames.users)
        .select("*")
        .eq("accountId", d.data.session.user.id);
      if (error) {
        console.error("error:", error);
        throw new Error("Error");
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
      .select("*,creator:users(*)")
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
    console.error(
      "You can’t fetch other users unless you provide your own user ID"
    );
    return;
  }
  // TODO: except myself and followers
  try {
    const { data, error } = await supabase
      .from(tableNames.users)
      .select("imageUrl,name,username,accountId")
      .limit(10)
      .neq("accountId", userId);
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

async function getPostById(postId) {
  if (!postId) {
    console.error("You can’t fetch post unless you provide your post ID");
    return;
  }
  try {
    const { data, error } = await supabase
      .from(tableNames.posts)
      .select("*,creator:users(*)")
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
      .select("*,creator:users(*)")
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

async function deletePost(imageId) {
  if (!imageId) return;
  try {
    const { error } = await supabase
      .from(tableNames.posts)
      .delete()
      .eq("imageId", imageId);

    if (error) {
      console.error("error:", error);
      throw new Error("Error");
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
  getUserPosts,
  deletePost,
};

// [
//     {
//         "tags": [
//             "Post",
//             "AI",
//             "Art"
//         ],
//         "imageId": "4f6a84d1-6421-407a-a77c-45b7d0eda75e",
//         "imageUrl": "https://<myProjectId>.supabase.co/storage/v1/object/public/media/35e4b5ad-3333-4209-b0f3-697ee0ed6ce1/4f6a84d1-6421-407a-a77c-45b7d0eda75e.png",
//         "location": "USA",
//         "caption": "Tom cruise",
//         "likes": null,
//         "creator": {
//             "bio": null,
//             "name": "aaa",
//             "email": "aaa@gmail.com",
//             "liked": null,
//             "posts": null,
//             "imageId": null,
//             "imageUrl": "https://ui-avatars.com/api/?name=aaa&size=256&bold=true&length=1",
//             "username": "aaa123",
//             "accountId": "35e4b5ad-3333-4209-b0f3-697ee0ed6ce1"
//         },
//         "createdAt": "2025-08-06T07:45:07.793Z",
//         "updatedAt": "2025-08-06T08:15:44.854Z"
//     },
//     {
//         "tags": [
//             "Logo",
//             "blue",
//             "tube"
//         ],
//         "imageId": "b92761bd-425f-46da-88ff-cdd76c5c57db",
//         "imageUrl": "https://<myProjectId>.supabase.co/storage/v1/object/public/media/c9201c7f-b6d3-4135-aeb5-dc5c18497182/b92761bd-425f-46da-88ff-cdd76c5c57db.png",
//         "location": "NYC",
//         "caption": "Meta logo ",
//         "likes": null,
//         "creator": null,
//         "createdAt": "2025-08-06T08:13:30.515Z",
//         "updatedAt": "2025-08-06T08:13:30.515Z"
//     },
//     {
//         "tags": [
//             "Sun",
//             "nature",
//             "gift"
//         ],
//         "imageId": "c944030b-82ca-4369-9082-f45ca5420b30",
//         "imageUrl": "https://<myProjectId>.supabase.co/storage/v1/object/public/media/35e4b5ad-3333-4209-b0f3-697ee0ed6ce1/c944030b-82ca-4369-9082-f45ca5420b30.jpg",
//         "location": "World",
//         "caption": "Feel the beauty of nature🎴",
//         "likes": null,
//         "creator": {
//             "bio": null,
//             "name": "aaa",
//             "email": "aaa@gmail.com",
//             "liked": null,
//             "posts": null,
//             "imageId": null,
//             "imageUrl": "https://ui-avatars.com/api/?name=aaa&size=256&bold=true&length=1",
//             "username": "aaa123",
//             "accountId": "35e4b5ad-3333-4209-b0f3-697ee0ed6ce1"
//         },
//         "createdAt": "1754465489139",
//         "updatedAt": "1754465489139"
//     },
//     {
//         "tags": [
//             "Action",
//             "ancient",
//             "modern"
//         ],
//         "imageId": "c4b90a5d-4105-4b74-aa89-14bfbca4ff83",
//         "imageUrl": "https://<myProjectId>.supabase.co/storage/v1/object/public/media/35e4b5ad-3333-4209-b0f3-697ee0ed6ce1/c4b90a5d-4105-4b74-aa89-14bfbca4ff83.jpg",
//         "location": "USA",
//         "caption": "Charlize Theron",
//         "likes": null,
//         "creator": {
//             "bio": null,
//             "name": "aaa",
//             "email": "aaa@gmail.com",
//             "liked": null,
//             "posts": null,
//             "imageId": null,
//             "imageUrl": "https://ui-avatars.com/api/?name=aaa&size=256&bold=true&length=1",
//             "username": "aaa123",
//             "accountId": "35e4b5ad-3333-4209-b0f3-697ee0ed6ce1"
//         },
//         "createdAt": "1754465111310",
//         "updatedAt": "1754465111310"
//     },
//     {
//         "tags": [
//             "Movie",
//             "photo",
//             "star"
//         ],
//         "imageId": "52c3e5c2-f2e0-45dd-a021-00b92560247b",
//         "imageUrl": "https://<myProjectId>.supabase.co/storage/v1/object/public/media/35e4b5ad-3333-4209-b0f3-697ee0ed6ce1/52c3e5c2-f2e0-45dd-a021-00b92560247b.jpg",
//         "location": "USA",
//         "caption": "Milla Jovovich",
//         "likes": null,
//         "creator": {
//             "bio": null,
//             "name": "aaa",
//             "email": "aaa@gmail.com",
//             "liked": null,
//             "posts": null,
//             "imageId": null,
//             "imageUrl": "https://ui-avatars.com/api/?name=aaa&size=256&bold=true&length=1",
//             "username": "aaa123",
//             "accountId": "35e4b5ad-3333-4209-b0f3-697ee0ed6ce1"
//         },
//         "createdAt": "1754465039061",
//         "updatedAt": "1754465039061"
//     }
// ]
