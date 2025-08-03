import { useMutation, useQuery } from "@tanstack/react-query";
import { saveUserToDB } from "../../supabase/database";

export const useSaveUserToDB = () => {
  return useMutation({
    mutationFn: (user) => saveUserToDB(user),
  });
};
