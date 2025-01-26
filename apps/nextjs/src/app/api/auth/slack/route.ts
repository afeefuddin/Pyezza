import { SlackOauth } from "@/lib/slack-oauth";
import { redirect } from "next/navigation";

export async function GET() {
  const slackOauth = new SlackOauth();
  const url = await slackOauth.getAuthUrl();
  redirect(url);
}
