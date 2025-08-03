import supabase from "./config";
import { tableNames } from "../lib/constants";

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

export { saveUserToDB };
