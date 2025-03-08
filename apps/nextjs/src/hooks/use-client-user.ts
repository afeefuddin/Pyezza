import { useUser } from "@clerk/nextjs";
import { User } from "@repo/types/user";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useClientUser() {
  const { isSignedIn } = useUser();
  const { data } = useQuery({
    queryKey: ["user-data"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/user");
        return response.data.result as User;
      } catch {
        return null;
      }
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: isSignedIn,
  });

  return data;
}
