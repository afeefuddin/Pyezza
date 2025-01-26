import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import {getUser} from "@/actions/user";

export async function GET() {
  const data = await currentUser();
  if (!data) {
    redirect("/login");
  } else {
    try {
      await getUser();
    } catch (error) {
      console.log(error);
    }
    redirect("/");
  }
}
