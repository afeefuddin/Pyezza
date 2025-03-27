import { getUser } from "@/actions/user";
import { SlackOauth } from "@/lib/slack-oauth";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { prisma } from "@repo/database";
import { encrypt } from "@repo/lib/encrypt";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    redirect("/dashboard?error=slackuser");
  }
  const searchParams = request.nextUrl.searchParams;
  const state = searchParams.get("state");
  const slackOauth = new SlackOauth();
  const valid = await slackOauth.verifyState(state);

  if (!valid) {
    redirect("/dashboard?error=slackvalid");
  }
  const code = searchParams.get("code");
  if (!code) {
    redirect("/dashboard?error=slack");
  }

  const data = await slackOauth.getAccessTokenFromCode(code);
  if (!data) {
    redirect("/dashboard?error=slack");
  }

  await prisma.integration.upsert({
    where: {
      user: {
        id: user.id,
      },
      teamId: data.team.id,
    },
    update: {
      token: encrypt(data.access_token),
    },
    create: {
      teamId: data.team.id,
      teamName: data.team.name,
      type: "slack",
      token: encrypt(data.access_token),
      botUserId: data.bot_user_id,
      appId: data.app_id,
      scope: data.scope,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  redirect("/integrations?success=slack");
}
